'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '../../../styles/Travel.module.css';
import { useTravelDetail } from '@/hooks/useTravel';
import { useParams } from 'next/navigation';
import DataLoading from '@/components/Common/DataLoading';
import DetailPlaceMap from '@/components/Travel/DetailPlaceMap';
import ScheduleModal from '@/components/Schedule/ScheduleModal';
import { BookMarkApi, BookMarkDeleteApi } from '@/api/bookMarkApi';
import favicon from '../../../../public/favicon.ico';

const TravelDetail = () => {
  const { placeId } = useParams();
  const placeIdNumber = parseInt(placeId as string, 10);
  const { data, isLoading, error } = useTravelDetail(placeIdNumber);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const nextRef = useRef(null);
  const prevRef = useRef(null);
  
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        setIsBookmarked(false);
      } catch (error) {
        console.error('북마크 상태 확인 중 오류 발생:', error);
      }
    };
    
    fetchBookmarkStatus();
  }, [placeIdNumber]);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleSchedule = () => {
    closeModal();
  };
  
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await BookMarkDeleteApi({ placeId: placeIdNumber });
        setIsBookmarked(false);
      } else {
        await BookMarkApi({ placeId: placeIdNumber });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('북마크 처리 중 오류 발생:', error);
    }
  };
  
  if (isLoading) return <DataLoading />;
  if (error) return <p>Error: {error.message}</p>;
  
  const {
    placeName,
    country,
    city,
    district,
    address,
    detailAddress,
    description,
    imageList,
    latitude,
    longitude,
    phoneNumber,
    homepage
  } = data?.data || {};
  
  return (
    <div className={styles.travelDetailContent}>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          {imageList && imageList.length > 0 ? (
            <div className={styles.swiperContainer}>
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                navigation={{
                  nextEl: nextRef.current, // Ref로 버튼 연결
                  prevEl: prevRef.current, // Ref로 버튼 연결
                }}
                loop
              >
                {imageList.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.sliderImageContainer}>
                      {imageLoading && <div>로딩 중...</div>}
                      <Image
                        src={image.imageUrl}
                        alt={image.imageName}
                        width={749}
                        height={512}
                        style={{ objectFit: 'cover' }}
                        onLoad={() => setImageLoading(false)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button ref={prevRef} className={styles.swiperButtonPrev}>‹</button>
              <button ref={nextRef} className={styles.swiperButtonNext}>›</button>
            </div>
          ) : (
            <div className={styles.noImage}>이미지가 없습니다.</div>
          )}
        </div>
        <div className={styles.rightSection}>
          <p className={styles.countryCityDistrict}>{country} > {city} > {district}</p>
          <h2 className={styles.placeName}>{placeName}</h2>
          <p className={styles.addressLabel}>주소: {address} {detailAddress}</p>
          <p className={styles.homepageLabel}>홈페이지: <p dangerouslySetInnerHTML={{ __html: homepage }} /></p>
          <p className={styles.phoneLabel}>문의 및 안내: {phoneNumber}</p>
          <div className={styles.buttonContainer}>
            <button className={styles.bookmarkBtn} onClick={toggleBookmark}>
              {isBookmarked ? '북마크 해제' : '북마크'}
            </button>
            <button className={styles.chooseBtn} onClick={openModal}>
              내 일정 담기
            </button>
          </div>
          <ScheduleModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleSchedule}
          />
        </div>
      </div>
      <h2 className={styles.detailTitle}>
        <Image
          src={favicon}
          alt={'파비콘'}
          style={{ marginLeft: '-15px' }}
          priority
        />상세 설명</h2>
      <div className={styles.infoSection}>
        <p className={styles.infoText}>
          {isExpanded
            ? description
            : `${description && description.slice(0, 340)}...`}
          <br /><br />
          <button
            onClick={handleExpandClick}
            className={styles.expandButton}
          >
            {isExpanded ? '접기 ▲' : ' 내용 더 보기 ▼'}
          </button>
        </p>
      </div>
      <DetailPlaceMap latitude={latitude ?? 0} longitude={longitude ?? 0} />
    </div>
  );
};

export default TravelDetail;
