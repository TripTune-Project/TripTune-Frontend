import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';
import {
  useScheduleTravelList,
  useTravelListByLocation,
} from '@/hooks/useSchedule';
import Image from 'next/image';
import locationIcon from '../../../public/assets/icons/ic_location.png';
import Pagination from '../Travel/Pagination';
import DataLoading from '@/components/Common/DataLoading';
import { Place } from '@/types/scheduleType';
import { useDebounce } from '@/hooks/useDebounce';

interface ScheduleTravelSearchProps {
  onAddMarker: (marker: { lat: number; lng: number }) => void;
}

const ScheduleTravelSearch = ({ onAddMarker }: ScheduleTravelSearchProps) => {
  const { scheduleId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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

  return (
    <>
      <div className={styles.travelSearchContainer}>
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
                  <p
                    className={styles.placeAddress}
                  >{`${place.country} / ${place.city} / ${place.district}`}</p>
                  <p className={styles.placeDetailAddress}>
                    <Image
                      src={locationIcon}
                      alt='장소'
                      width={15}
                      height={21}
                    />
                    &nbsp;{place.address} {place.detailAddress}
                  </p>
                  <div className={styles.distanceInfo}>
                    <button
                      className={styles.addButton}
                      onClick={() =>
                        onAddMarker({
                          lat: place.latitude,
                          lng: place.longitude,
                        })
                      }
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
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ScheduleTravelSearch;
