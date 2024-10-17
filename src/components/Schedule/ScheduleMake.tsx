import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';
import { fetchScheduleDetail, fetchTravelList, searchTravelDestinations, fetchTravelRoute } from '@/api/scheduleApi';
import Image from 'next/image';
import locationIcon from '../../../public/assets/icons/ic_location.png';
import Pagination from '../Travel/Pagination';
import { ScheduleDetail, Place } from '@/types/scheduleType';

interface ScheduleMakeProps {
  onAddMarker: (marker: { lat: number; lng: number; }) => void;
}

const ScheduleMake = ({ onAddMarker }: ScheduleMakeProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { scheduleId } = useParams();
  const initialTab = (searchParams.get('tab') || 'scheduleTravel') as 'scheduleTravel' | 'travelRoot';
  
  const [tab, setTab] = useState<'scheduleTravel' | 'travelRoot'>(initialTab);
  const [data, setData] = useState<ScheduleDetail | null>(null);
  const [travels, setTravels] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const fetchData = useCallback(async (fetchFn: Function, page: number) => {
    if (!scheduleId) return;
    try {
      const response = await fetchFn(Number(scheduleId), page);
      if (response && response.data) {
        const scheduleDetail = response.data as ScheduleDetail;
        setTravels(scheduleDetail.placeList?.content ?? []);
        setTotalPages(scheduleDetail.placeList?.totalPages ?? 0);
      } else {
        setTravels([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [scheduleId]);
  
  const fetchRouteData = useCallback(async (page: number) => {
    if (!scheduleId) return;
    try {
      const response = await fetchTravelRoute(Number(scheduleId), page);
      if (response && response.data) {
        const routeDetail = response.data;
        
        if (routeDetail?.placeList?.content !== undefined) {
          setTravels(routeDetail.placeList.content ?? []);
          setTotalPages(routeDetail.placeList.totalPages ?? 0);
        } else {
          console.warn('routeDetail에 content 속성이 없습니다.');
          setTravels([]);
        }
      } else {
        setTravels([]);
      }
    } catch (error) {
      console.error('Failed to fetch route data:', error);
    }
  }, [scheduleId]);
  
  const handleAddMarker = (place: Place) => {
    const marker = {
      lat: place.latitude ?? 0,
      lng: place.longitude ?? 0,
    };
    console.log('추가된 마커:', marker);
    onAddMarker(marker);
  };
  
  useEffect(() => {
    if (tab === 'scheduleTravel') {
      fetchData(fetchScheduleDetail, currentPage);
    } else if (tab === 'travelRoot') {
      fetchRouteData(currentPage);
    }
  }, [fetchData, fetchRouteData, tab, currentPage]);
  
  const handleTabChange = (newTab: 'scheduleTravel' | 'travelRoot') => {
    setTab(newTab);
    setCurrentPage(1);
  };
  
  const handleTravelSearch = async () => {
    setCurrentPage(1);
    setIsSearching(true);
    try {
      await fetchData(searchTravelDestinations, 1);
    } catch (error) {
      console.error('여행지 검색 실패:', error);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (isSearching) {
      fetchData(searchTravelDestinations, page);
    } else {
      if (tab === 'scheduleTravel') {
        fetchData(fetchTravelList, page);
      } else if (tab === 'travelRoot') {
        fetchRouteData(page);
      }
    }
  };
  
  const handleDetailClick = (placeId: number) => {
    router.push(`/Travel/${placeId}`);
  };
  
  return (
    <div className={styles.pageContainer}>
      <div>
        <h1 className={styles.detailTitle}>일정 만들기</h1>
        <div className={styles.inputGroup}>
          <label>여행 이름</label>
          <input
            type="text"
            className={styles.inputField}
            placeholder="여행 이름을 입력해주세요."
            value={data?.scheduleName || ''}
            readOnly
          />
        </div>
        <div className={styles.inputGroup}>
          <label>여행 날짜</label>
          <input
            type="text"
            className={styles.inputField}
            value={`${data?.startDate ?? ''} ~ ${data?.endDate ?? ''}`}
            readOnly
          />
        </div>
      </div>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${tab === 'scheduleTravel' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('scheduleTravel')}
        >
          여행지
        </button>
        <button
          className={`${styles.tabButton} ${tab === 'travelRoot' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('travelRoot')}
        >
          여행 루트
        </button>
      </div>
      {tab === 'scheduleTravel' && (
        <>
          <div className={styles.travelSearchContainer}>
            <input
              type="text"
              placeholder="원하는 여행지를 검색하세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button onClick={handleTravelSearch}>돋보기</button>
          </div>
          <div className={styles.travelList}>
            {travels && travels.length > 0 ? (
              travels.map((place) => (
                <li
                  key={place.placeId}
                  className={styles.placeItem}
                  onClick={() => handleDetailClick(place.placeId)}
                >
                  <div className={styles.placeThumbnail}>
                    {place.thumbnailUrl ? (
                      <Image
                        src={place.thumbnailUrl}
                        alt={place.placeName}
                        width={150}
                        height={150}
                        className={styles.thumbnailImage}
                        priority
                      />
                    ) : (
                      <div className={styles.noImage}>이미지 없음</div>
                    )}
                  </div>
                  <div className={styles.placeInfo}>
                    <div className={styles.placeName}>{place.placeName}</div>
                    <p className={styles.placeAddress}>
                      {`${place.country} / ${place.city} / ${place.district}`}
                    </p>
                    <p className={styles.placeDetailAddress}>
                      <Image
                        src={locationIcon}
                        alt="장소"
                        width={15}
                        height={21}
                      />
                      &nbsp;
                      {place.address} {place.detailAddress}
                    </p>
                    <div className={styles.distanceInfo}>
                      <button
                        className={styles.addButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddMarker(place);
                        }}
                      >
                        추가
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className={styles.noResults}>검색 결과가 없습니다.</p>
            )}
          </div>
          <Pagination
            total={totalPages * 5}
            currentPage={currentPage}
            pageSize={5}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ScheduleMake;
