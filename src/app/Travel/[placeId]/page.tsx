'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styled from 'styled-components';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '../../../styles/Travel.module.css';
import { useTravelDetail } from '@/hooks/useTravel';
import { useRouter, useParams } from 'next/navigation';
import DataLoading from '@/components/Common/DataLoading';
import DetailPlaceMap from '@/components/Travel/DetailPlaceMap';

const StyledSwiperContainer = styled.div`
    overflow: hidden;
    position: relative;
    width: 100%;
    max-width: 1850px;
    margin: 0 auto;
`;

const StyledSwiperButtonPrev = styled.div`
    position: absolute;
    top: 50%;
    width: 60px;
    height: 60px;
    left: 10px;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
    user-select: none;

    &::after {
        content: '';
        display: block;
        width: 60px;
        height: 60px;
        background-size: cover;
        background-image: url('/assets/images/left_btn.png');
    }
`;

const StyledSwiperButtonNext = styled.div`
    position: absolute;
    top: 50%;
    width: 60px;
    height: 60px;
    right: 10px;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10;
    user-select: none;

    &::after {
        content: '';
        display: block;
        width: 60px;
        height: 60px;
        background-size: cover;
        background-image: url('/assets/images/right_btn.png');
    }
`;

const TravelDetail = () => {
  const router = useRouter();
  const { placeId } = useParams();
  const placeIdNumber = parseInt(placeId as string, 10);
  const { data, isLoading, error } = useTravelDetail(placeIdNumber);
  
  const [isExpanded, setIsExpanded] = useState(false);
  
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
  } = data?.data || {};
  
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={styles.travelDetailContent}>
      <h1 className={styles.travelSearchDetail}>여행지 탐색 : {placeName} 상세보기</h1>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <StyledSwiperContainer>
            {imageList && imageList.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                loop
              >
                {imageList.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.sliderImageContainer}>
                      <Image
                        src={image.imageUrl}
                        alt={image.imageName}
                        width={500}
                        height={500}
                        className={styles.detailSliderImg}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
                <StyledSwiperButtonPrev className="swiper-button-prev" />
                <StyledSwiperButtonNext className="swiper-button-next" />
              </Swiper>
            ) : (
              <div className={styles.noImage}>
                이미지가 없습니다.
              </div>
            )}
          </StyledSwiperContainer>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>📍</span>
            <p className={styles.infoText}>{country} / {city} / {district}</p>
          </div>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>🏢</span>
            <p className={styles.infoText}>장소명 : {placeName}</p>
          </div>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>🗺️</span>
            <p className={styles.infoText}>주소 : {address} {detailAddress}</p>
          </div>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>📝</span>
            <p className={styles.infoText}>
              설명 : <br />
              {isExpanded ? description : `${description && description.slice(0, 100)}...`}
              <button onClick={handleExpandClick} className={styles.expandButton}>
                {isExpanded ? '접기 ▲' : '더 보기 ▼'}
              </button>
            </p>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.backBtn} onClick={() => router.back()}>뒤로 가기</button>
          <button className={styles.ChooseBtn}>내 일정 담기</button>
          <button className={styles.bookmarkBtn}>북마크</button>
        </div>
        <DetailPlaceMap latitude={latitude ?? 0} longitude={longitude ?? 0} />
      </div>
    </div>
  );
};

export default TravelDetail;
