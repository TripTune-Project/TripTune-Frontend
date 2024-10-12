import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';
import { getSchedule, getTravels } from '@/api/scheduleApi';
import Image from 'next/image';
import bookMarkIcon from '../../../public/assets/icons/ic_bookmark.png';
import bookMarkIconNo from '../../../public/assets/icons/ic_bookmark_no.png';
import locationIcon from '../../../public/assets/icons/ic_location.png';
import Pagination from '../Travel/Pagination';
import PlacesScheduleMap from './PlacesScheduleMap';
import { BookMarkApi, BookMarkDeleteApi } from '@/api/bookMarkApi';
import { ScheduleDetail, Place } from '@/types/scheduleType';

const ScheduleMake = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { scheduleId } = useParams();
  const initialTab = (searchParams.get('tab') || 'scheduleTravel') as 'scheduleTravel' | 'travelRoot';
  
  const [tab, setTab] = useState<'scheduleTravel' | 'travelRoot'>(initialTab);
  const [data, setData] = useState<ScheduleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [travels, setTravels] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [markers, setMarkers] = useState<{ lat: number; lng: number; name: string }[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | ''>('');
  const [alertOpen, setAlertOpen] = useState(false);
  
  const fetchScheduleData = useCallback(async (page: number) => {
    if (!scheduleId) return;
    try {
      setIsLoading(true);
      const scheduleData = await getSchedule(Number(scheduleId), page);
      if (scheduleData && scheduleData.data) {
        const scheduleDetail = scheduleData.data as ScheduleDetail;
        setData(scheduleDetail);
        setTravels(scheduleDetail.placeList?.content ?? []);
        setTotalPages(scheduleDetail.placeList?.totalPages ?? 0);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Failed to fetch schedule data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId]);
  
  const fetchTravels = useCallback(async (page: number) => {
    if (!scheduleId) return;
    try {
      setIsLoading(true);
      const travelData = await getTravels(Number(scheduleId), page);
      if (travelData && travelData.data) {
        const travelDetail = travelData.data as ScheduleDetail;
        setTravels(travelDetail.placeList?.content ?? []);
        setTotalPages(travelDetail.placeList?.totalPages ?? 0);
      } else {
        setTravels([]);
      }
    } catch (error) {
      console.error('Failed to fetch travels:', error);
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId]);
  
  const handleAddMarker = (place: Place) => {
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      { lat: place.latitude ?? 0, lng: place.longitude ?? 0, name: place.placeName },
    ]);
  };
  
  useEffect(() => {
    fetchScheduleData(currentPage);
  }, [fetchScheduleData, currentPage]);
  
  const handleTabChange = (newTab: 'scheduleTravel' | 'travelRoot') => {
    setTab(newTab);
  };
  
  const handleTravelSearch = async () => {
    setCurrentPage(1);
    setIsSearching(true);
    await fetchTravels(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    isSearching ? fetchTravels(page) : fetchScheduleData(page);
  };
  
  const handleDetailClick = (placeId: number) => {
    router.push(`/Travel/${placeId}`);
  };
  
  const toggleBookmark = useCallback(async (placeId: number, isBookmarked = false) => {
    try {
      if (isBookmarked) {
        await BookMarkDeleteApi({ placeId });
        setAlertMessage('북마크가 해제되었습니다.');
      } else {
        await BookMarkApi({ placeId });
        setAlertMessage('북마크가 등록되었습니다.');
      }
      setAlertSeverity('success');
    } catch (error) {
      setAlertMessage('북마크 처리 중 오류가 발생했습니다.');
      setAlertSeverity('error');
    } finally {
      setAlertOpen(true);
    }
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
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
            <input type="text" placeholder="원하는 여행지를 검색하세요" />
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
                    <button
                      className={styles.bookmarkButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(place.placeId, place.isBookmarked ?? false);
                      }}
                    >
                      {place.isBookmarked ? (
                        <Image
                          src={bookMarkIcon}
                          alt="북마크"
                          width={16}
                          height={16}
                          priority
                        />
                      ) : (
                        <Image
                          src={bookMarkIconNo}
                          alt="북마크 해제"
                          width={16}
                          height={16}
                          priority
                        />
                      )}
                    </button>
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
          <PlacesScheduleMap
            places={travels.map((place) => ({
              latitude: place.latitude ?? 0,
              longitude: place.longitude ?? 0,
            }))}
            markers={markers}
          />
        </>
      )}
    </div>
  );
};

export default ScheduleMake;
