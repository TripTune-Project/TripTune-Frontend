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

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const BookMark = () => {
  const [place] = useState<Place>({
    thumbnailUrl: '',
    placeName: '서울 타워',
    country: '대한민국',
    city: '서울',
    district: '중구',
    address: '서울특별시 중구 남산공원길',
    detailAddress: '105',
  });
  
  const [totalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  return (
    <div>
      <strong>북마크</strong>
      <div><strong>전체</strong>
        <div>3</div>
      </div>
      <div>등록 날짜 순</div>
      <div>
        <div className={styles.placeThumbnail}>
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
            <div className={styles.noImage}>
              이미지 없음
            </div>
          )}
        </div>
        <div className={styles.placeName}>
          {place.placeName}
        </div>
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
      </div>
      {totalPages > 0 && (
        <Pagination
          total={totalPages * 5}
          currentPage={currentPage}
          pageSize={5}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default BookMark;
