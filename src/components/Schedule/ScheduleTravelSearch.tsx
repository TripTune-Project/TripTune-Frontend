import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';
import {
  useScheduleTravelList,
  useTravelListByLocation,
} from '@/hooks/useSchedule';
import { useTravelStore } from '@/store/scheduleStore';
import Image from 'next/image';
import locationIcon from '../../../public/assets/images/일정 만들기/일정 저장 및 수정/mapIcon.png';
import Pagination from '../Travel/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import DataLoading from '@/components/Common/DataLoading';
import { truncateText } from '@/utils';
import { Place } from '@/types/scheduleType';
import AlertIcon from '../../../public/assets/images/여행지 탐색/홈화면/alertIcon.png';
import plusTravelSearch from '../../../public/assets/images/일정 만들기/일정 저장 및 수정/plusIcon.png';
import minusTravelSearch from '../../../public/assets/images/일정 만들기/일정 저장 및 수정/minusBtn.png';

const ScheduleTravelSearch = () => {
  const { scheduleId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const markersRef = useRef<any[]>([]);

  const {
    addPlaceToRoute,
    addedPlaces,
    addPlace,
    removePlace,
    removePlaceFromRoute,
  } = useTravelStore();

  const debouncedSearchKeyword = useDebounce(searchKeyword, 800);

  const travelListQuery = useScheduleTravelList(
    Number(scheduleId),
    currentPage,
    !isSearching
  );
  const searchTravelQuery = useTravelListByLocation(
    Number(scheduleId),
    debouncedSearchKeyword,
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

  useEffect(() => {
    if (debouncedSearchKeyword.trim()) {
      setCurrentPage(1);
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchKeyword]);

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
      removeMarker(place.latitude, place.longitude); // 수정된 호출
    } else {
      addPlace({
        placeId: place.placeId,
        lat: place.latitude,
        lng: place.longitude,
      });
      addPlaceToRoute(place);
    }
  };

  return (
    <>
      <div className={styles.travelSearchContainerSearch}>
        <input
          type='text'
          placeholder='원하는 여행지를 검색하세요'
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={() => setIsSearching(true)}>검색</button>
      </div>
      <div className={styles.travelList}>
        {travels.length > 0 ? (
          <ul>
            {travels.map((place: Place) => (
              <li key={place.placeId} className={styles.placeItem}>
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
                    {truncateText(place.placeName, 20)}
                  </div>
                  <p className={styles.placeAddress}>
                    {truncateText(
                      `${place.country} / ${place.city} / ${place.district}`,
                      20
                    )}
                  </p>
                  <p className={styles.placeDetailAddress}>
                    <Image
                      src={locationIcon}
                      alt='장소'
                      width={15}
                      height={21}
                    />
                    &nbsp;{place.address} {place.detailAddress ?? ''}
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
        ) : (
          <p className={styles.noResults}>
            <Image
              src={AlertIcon}
              alt={'no-schedule'}
              width={80}
              height={80}
              style={{ marginLeft: '220px' }}
            />
            <div className={styles.noText}>검색 결과가 없습니다.</div>
            <br />
            <p>검색어의 철자와 띄어쓰기가 정확한지 확인해주세요.</p>
          </p>
        )}
      </div>
      {totalPages > 0 && (
        <Pagination
          total={totalPages * 5}
          currentPage={currentPage}
          pageSize={5}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default ScheduleTravelSearch;
