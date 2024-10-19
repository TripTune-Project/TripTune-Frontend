import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';
import {
  useScheduleDetailList,
  useScheduleTravelList,
  useTravelListByLocation,
  useScheduleTravelRoute,
} from '@/hooks/useSchedule';
import Image from 'next/image';
import locationIcon from '../../../public/assets/icons/ic_location.png';
import Pagination from '../Travel/Pagination';
import { ScheduleDetailType, ScheduleTravelResultType } from '@/types/scheduleType';
import DataLoading from '@/components/Common/DataLoading';

interface ScheduleMakeProps {
  onAddMarker: (marker: { lat: number; lng: number }) => void;
}

const ScheduleMake = ({ onAddMarker }: ScheduleMakeProps) => {
  const router = useRouter();
  const { scheduleId } = useParams();
  const searchParams = useSearchParams();
  
  const initialTab = (searchParams.get('tab') || 'scheduleTravel') as 'scheduleTravel' | 'travelRoot';
  
  const [tab, setTab] = useState<'scheduleTravel' | 'travelRoot'>(initialTab);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [scheduleDetail, setScheduleDetail] = useState<ScheduleDetailType | null>(null);
  
  const scheduleDetailQuery = useScheduleDetailList(Number(scheduleId), currentPage, tab === 'scheduleTravel' && !isSearching);
  const travelListQuery = useScheduleTravelList(Number(scheduleId), currentPage, tab === 'scheduleTravel' && !isSearching);
  const searchTravelQuery = useTravelListByLocation(Number(scheduleId), searchKeyword, currentPage, isSearching);
  const travelRouteQuery = useScheduleTravelRoute(Number(scheduleId), currentPage, tab === 'travelRoot');
  
  const getTravels = () => {
    if (isSearching) return searchTravelQuery?.data?.data?.content || [];
    if (tab === 'travelRoot') return travelRouteQuery?.data?.data?.content || [];
    return travelListQuery?.data?.data?.content || [];
  };
  
  const getTotalPages = () => {
    if (isSearching) return searchTravelQuery?.data?.data?.totalPages || 0;
    if (tab === 'travelRoot') return travelRouteQuery?.data?.data?.totalPages || 0;
    return travelListQuery?.data?.data?.totalPages || 0;
  };
  
  const travels = getTravels();
  const totalPages = getTotalPages();
  
  const handleTabChange = (newTab: 'scheduleTravel' | 'travelRoot') => {
    setTab(newTab);
    setCurrentPage(1);
    setIsSearching(false);
  };
  
  const handleTravelSearch = () => {
    setCurrentPage(1);
    setIsSearching(true);
  };
  
  const handlePageChange = (page: number) => setCurrentPage(page);
  
  const handleDetailClick = (placeId: number) => router.push(`/Travel/${placeId}`);
  
  const handleAddMarker = (place: ScheduleTravelResultType) => {
    const marker = { lat: place.latitude, lng: place.longitude };
    onAddMarker(marker);
  };
  
  const handleScheduleDetailChange = (field: keyof ScheduleDetailType, value: string) => {
    if (scheduleDetail) setScheduleDetail({ ...scheduleDetail, [field]: value });
  };
  
  useEffect(() => {
    if (scheduleDetailQuery?.data?.data) {
      setScheduleDetail(scheduleDetailQuery.data.data);
    }
  }, [scheduleDetailQuery]);
  
  if (scheduleDetailQuery.isLoading || travelListQuery.isLoading || searchTravelQuery.isLoading || travelRouteQuery.isLoading) {
    return <DataLoading />;
  }
  
  if (scheduleDetailQuery.error || travelListQuery.error || searchTravelQuery.error || travelRouteQuery.error) {
    return <p>데이터를 불러오는데 오류가 발생했습니다.</p>;
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
            value={scheduleDetail?.scheduleName || ''}
            onChange={(e) => handleScheduleDetailChange('scheduleName', e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>여행 날짜</label>
          <input
            type="text"
            className={styles.inputField}
            placeholder="시작일 ~ 종료일"
            value={`${scheduleDetail?.startDate ?? ''} ~ ${scheduleDetail?.endDate ?? ''}`}
            onChange={(e) => {
              const [startDate, endDate] = e.target.value.split(' ~ ');
              handleScheduleDetailChange('startDate', startDate);
              handleScheduleDetailChange('endDate', endDate);
            }}
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
      {tab === 'scheduleTravel' ? (
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
            {travels.length > 0 ? (
              <ul>
                {travels.map((place) => (
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
                        <Image src={locationIcon} alt="장소" width={15} height={21} />
                        &nbsp;{place.address} {place.detailAddress}
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
                ))}
              </ul>
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
      ) : (
        <>
          {travels.length > 0 ? (
            <ul>
              {travels.map((place) => (
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
                      <Image src={locationIcon} alt="장소" width={15} height={21} />
                      &nbsp;{place.address} {place.detailAddress}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noResults}>여행지에서 추가를 해보세요.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ScheduleMake;
