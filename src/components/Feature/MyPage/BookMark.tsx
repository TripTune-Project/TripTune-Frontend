import React, { useState } from 'react';
import Pagination from '@/components/Common/Pagination';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTravelListByLocation } from '@/hooks/useTravel';
import { useTravelStore } from '@/store/travelStore';
import NoResultLayout from '@/components/Common/NoResult';
import locationIcon from '../../../../public/assets/images/여행지 탐색/홈화면/placeHome_mapIcon.png';
import styles from '@/styles/Mypage.module.css';
// import React, { useEffect, useState } from 'react';
// import { getBookmarks } from '@/apis/MyPage/myPageApi';
// import DataLoading from '@/components/Common/DataLoading';
// import { BookmarkPlace } from '@/types/myPage';
// TODO : 참고할 코드 위치
// https://github.com/TripTune-Project/TripTune-Frontend/blob/a61256d676e78aecd01d16a65a4eee61dead5883/src/components/Feature/MyPage/BookMark.tsx

interface Place {
  thumbnailUrl?: string;
  placeName: string;
  country: string;
  city: string;
  district: string;
  address: string;
  detailAddress?: string;
}

const BookMark = () => {
  const router = useRouter();
  const { currentPage, setCurrentPage } = useTravelStore();

  const [orderBy, setOrderBy] = useState('newest');
  const [coordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const defaultCoordinates = {
    latitude: 37.5642135,
    longitude: 127.0016985,
  };

  const { data: locationData } = useTravelListByLocation(
    coordinates ?? defaultCoordinates,
    currentPage
  );

  const handleDetailClick = (placeId: number) => {
    router.push(`/Travel/${placeId}`);
  };

  const places = locationData?.data?.content;
  const totalPages = locationData?.data?.totalPages ?? 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.leftHeader}>
          <div className={styles.pageTitle}>북마크</div>
          <div className={styles.totalCount}>전체 개수 5</div>
        </div>
        <div className={styles.rightHeader}>
          <select
            className={styles.orderSelect}
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <option value='newest'>최신순</option>
            <option value='oldest'>오래된 순</option>
            <option value='name'>이름 순</option>
          </select>
        </div>
      </div>

      <div className={styles.bookmarkGrid}>
        {places && places.length > 0 ? (
          places.map((place) => (
            <div
              key={place.placeId}
              className={styles.bookmarkCard}
              onClick={() => handleDetailClick(place.placeId)}
            >
              <div className={styles.imageContainer}>
                {place.thumbnailUrl ? (
                  <Image
                    src={place.thumbnailUrl}
                    alt={place.placeName}
                    width={95}
                    height={95}
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
                  <Image src={locationIcon} alt='장소' width={15} height={21} />
                  {` ${place.address} ${place.detailAddress}`}
                </p>
              </div>
            </div>
          ))
        ) : (
          <NoResultLayout />
        )}
      </div>

      {places && places.length > 0 && totalPages > 0 && (
        <Pagination
          total={totalPages * 5}
          currentPage={currentPage}
          pageSize={5}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BookMark;
