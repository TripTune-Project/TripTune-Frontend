import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';
import {
  useScheduleTravelList,
  useTravelListByLocation,
} from '@/hooks/useSchedule';
import { useTravelStore } from '@/store/scheduleStore';
import Image from 'next/image';
import locationIcon from '../../../../public/assets/images/일정 만들기/일정 저장 및 수정/mapIcon.png';
import Pagination from '@/components/Common/Pagination';
import DataLoading from '@/components/Common/DataLoading';
import { truncateText } from '@/utils';
import { Place } from '@/types/scheduleType';
import plusTravelSearch from '../../../../public/assets/images/일정 만들기/일정 저장 및 수정/plusIcon.png';
import minusTravelSearch from '../../../../public/assets/images/일정 만들기/일정 저장 및 수정/minusBtn.png';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

const ScheduleTravelSearch = () => {
  // useParams의 반환 타입을 업데이트
  const params = useParams();
  const scheduleId = params?.scheduleId as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const markersRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 알림 관련 상태 추가
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info');

  const {
    addPlaceToRoute,
    addedPlaces,
    addPlace,
    removePlace,
    removePlaceFromRoute,
    fetchAndMergeRoutes,
  } = useTravelStore();

  // 여행지 검색과 여행루트 데이터 동기화
  useEffect(() => {
    const loadTravelRoutes = async () => {
      if (scheduleId) {
        await fetchAndMergeRoutes(Number(scheduleId));
        useTravelStore.getState().addedPlaces;
      }
    };
    loadTravelRoutes();
  }, [fetchAndMergeRoutes, scheduleId]);
  
  // 기본 리스트 쿼리
  const travelListQuery = useScheduleTravelList(
    Number(scheduleId),
    currentPage,
    !isSearching
  );
  
  // 검색 리스트 쿼리
  const searchTravelQuery = useTravelListByLocation(
    Number(scheduleId),
    searchKeyword,
    currentPage,
    isSearching
  );

  const removeMarker = useCallback((latitude: number, longitude: number) => {
    const markerIndex = markersRef.current.findIndex(
      (marker) =>
        marker.position.lat() === latitude &&
        marker.position.lng() === longitude
    );

    if (markerIndex > -1) {
      const [removedMarker] = markersRef.current.splice(markerIndex, 1);
      removedMarker.setMap(null); // setMap을 통해 지도에서 제거
    }
  }, []);

  const travels = isSearching
    ? searchTravelQuery?.data?.data?.content || []
    : travelListQuery?.data?.data?.content || [];
  const totalPages = isSearching
    ? searchTravelQuery?.data?.data?.totalPages || 0
    : travelListQuery?.data?.data?.totalPages || 0;

  if (travelListQuery.isLoading || searchTravelQuery.isLoading)
    return <DataLoading />;
  if (travelListQuery.error || searchTravelQuery.error)
    return <p>데이터를 불러오는데 오류가 발생했습니다.</p>;

  const handleAddOrRemovePlace = (place: Place) => {
    const placeExists = Array.from(addedPlaces).some(
      (addedPlace) => addedPlace.placeId === place.placeId
    );

    if (placeExists) {
      removePlace(place.placeId);
      removePlaceFromRoute(place.placeId);
      removeMarker(place.latitude, place.longitude);
    } else {
      addPlace({
        placeId: place.placeId,
        lat: place.latitude,
        lng: place.longitude,
      });
      addPlaceToRoute(place);
    }
  };
  
  // 검색어 변경 핸들러 - 특수문자 제한 추가
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9 ]*$/;
    
    if (regex.test(input)) {
      setSearchKeyword(input);
    } else {
      setAlertMessage('특수문자는 사용할 수 없습니다. 다른 검색어를 입력해 주세요.');
      setAlertSeverity('warning');
      setAlertOpen(true);
    }
  };
  
  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    if (searchKeyword.trim()) {
      setIsSearchLoading(true);
      setIsSearching(true);
      setTimeout(() => {
        setIsSearchLoading(false);
      }, 500);
    }
  };

  return (
    <>
      <div className={styles.travelSearchContainerSearch}>
        <input
          ref={inputRef}
          type='text'
          placeholder='원하는 여행지를 검색하세요'
          value={searchKeyword}
          onChange={handleSearchInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      <div className={styles.travelList}>
        {isSearching && searchTravelQuery.isLoading ? (
          <DataLoading />
        ) : travels.length > 0 ? (
          <ul>
            {travels.map((place: Place) => (
              <li key={place.placeId} className={styles.placeItemSearch}>
                <div className={styles.placeThumbnail}>
                  {place.thumbnailUrl ? (
                    <Image
                      src={place.thumbnailUrl}
                      alt={place.placeName}
                      width={100}
                      height={100}
                      className={styles.thumbnailImage}
                      priority
                    />
                  ) : (
                    <div className={styles.noImage}>이미지 없음</div>
                  )}
                </div>
                <div className={styles.placeInfo}>
                  <div className={styles.placeName}>
                    {truncateText(place.placeName, 16)}
                  </div>
                  <p className={styles.placeAddress}>
                    {truncateText(
                      `${place.country} / ${place.city} / ${place.district}`,
                      16
                    )}
                  </p>
                  <p className={styles.placeDetailAddress}>
                    <Image
                      src={locationIcon}
                      alt='장소'
                      width={15}
                      height={21}
                    />
                    &nbsp;
                    {truncateText(
                      `${place.address} ${place.detailAddress ?? ''}`,
                      16
                    )}
                  </p>
                </div>
                <button
                  className={styles.addButton}
                  onClick={() => handleAddOrRemovePlace(place)}
                >
                  {Array.from(addedPlaces).some(
                    (addedPlace) => addedPlace.placeId === place.placeId
                  ) ? (
                    <Image src={minusTravelSearch} alt={'minusTravelSearch'} />
                  ) : (
                    <Image src={plusTravelSearch} alt={'plusTravelSearch'} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {totalPages > 0 && (
        <Pagination
          total={totalPages * 5}
          currentPage={currentPage}
          pageSize={5}
          onPageChange={setCurrentPage}
        />
      )}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ScheduleTravelSearch;
