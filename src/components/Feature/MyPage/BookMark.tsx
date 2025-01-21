import React, { useState } from 'react';
import Image from 'next/image';
import Pagination from '@/components/Common/Pagination';
import locationIcon from '../../../../public/assets/images/여행지 탐색/홈화면/placeHome_mapIcon.png';
import styles from '@/styles/Mypage.module.css';

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
  const [places] = useState<Place[]>([
    {
      thumbnailUrl: '',
      placeName: '서울 타워',
      country: '대한민국',
      city: '서울',
      district: '중구',
      address: '서울특별시 중구 남산공원길',
      detailAddress: '105',
    },
  ]);

  const [totalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <div className={styles.flexColumnC}>
      <span className={styles.accountManagement}>북마크</span>
      <div className={styles.flexRowAbe}>
        <div className={styles.regroup}>
          <div className={styles.dateRegistered}>등록 날짜순</div>
          <div className={styles.fullWidth}>전체 {places.length}</div>
        </div>
      </div>
      <div className={styles.flexRowD15}>
        {places.map((place, index) => (
          <div key={index} className={styles.rectangle16}>
            <div className={styles.tourapiFirstimage17}>
              {place.thumbnailUrl ? (
                <Image
                  src={place.thumbnailUrl}
                  alt={place.placeName}
                  width={95}
                  height={95}
                  priority
                />
              ) : (
                <div className={styles.noImage}>이미지 없음</div>
              )}
            </div>
            <span className={styles.koreaSeoulEunpyeonggu18}>
              {`${place.country} / ${place.city} / ${place.district}`}
            </span>
            <span className={styles.sugugasaSeoul}>{place.placeName}</span>
            <div className={styles.moreBtn19}>...</div>
            <span className={styles.seoulEunpyeongRoad}>
              <Image src={locationIcon} alt='장소' width={15} height={21} />
              &nbsp;{place.address} {place.detailAddress}
            </span>
          </div>
        ))}
      </div>
      {totalPages > 0 && (
        <div className={styles.flexRowD24}>
          <Pagination
            total={places.length}
            currentPage={currentPage}
            pageSize={5}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default BookMark;
