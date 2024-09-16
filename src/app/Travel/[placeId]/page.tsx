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
import favicon from '../../../../public/favicon.ico';
import placeIcon from '../../../../public/assets/images/place.png';
import { useTravelDetail } from '@/hooks/useTravel';
import { useRouter, useParams } from 'next/navigation';
import DataLoading from '@/components/Common/DataLoading';
import DetailPlaceMap from '@/components/Travel/DetailPlaceMap';

const StyledSwiperContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledSwiperButtonPrev = styled.div`
  position: absolute;
  top: 50%;
  width: 40px;
  height: 40px;
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
    width: 40px;
    height: 40px;
    background-size: cover;
    background-image: url('/assets/images/left_btn.png');
  }
`;

const StyledSwiperButtonNext = styled.div`
  position: absolute;
  top: 50%;
  width: 40px;
  height: 40px;
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
    width: 40px;
    height: 40px;
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
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBackClick = () => {
    router.back();
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: 북마크 API 호출 로직 추가 가능
  };

  const handleAddToSchedule = () => {
    // TODO : 내 일정에 담기 로직 구현 (API 호출 등)
    alert('일정에 추가되었습니다.');
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
    recommandedTravelList,
    latitude,
    longitude,
  } = data?.data || {};

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.travelDetailContent}>
      <h1 className={styles.travelSearchDetail}>
        여행지 탐색 : {placeName} 상세보기
      </h1>
      <div className={styles.buttonContainer}>
        <button onClick={handleBackClick} className={styles.backBtn}>
          뒤로 가기
        </button>
        <button onClick={handleBookmarkToggle} className={styles.bookmarkBtn}>
          {isBookmarked ? '북마크 해제' : '북마크'}
        </button>
        <button onClick={handleAddToSchedule} className={styles.ChooseBtn}>
          내 일정 담기
        </button>
      </div>
      <div className={styles.topSection}>
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
                  <Image
                    src={image.imageUrl}
                    alt={image.imageName}
                    width={800}
                    height={600}
                    className={styles.detailSliderImg}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </SwiperSlide>
              ))}
              <StyledSwiperButtonPrev className='swiper-button-prev' />
              <StyledSwiperButtonNext className='swiper-button-next' />
            </Swiper>
          ) : (
            <div className={styles.noImage}>이미지가 없습니다.</div>
          )}
        </StyledSwiperContainer>

        <div className={styles.rightSection}>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>🌍</span>
            <p className={styles.infoText}>국가 : {country}</p>
          </div>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>🏙️</span>
            <p className={styles.infoText}>도시 : {city}</p>
          </div>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>📍</span>
            <p className={styles.infoText}>구 : {district}</p>
          </div>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>🏢</span>
            <p className={styles.infoText}>장소명 : {placeName}</p>
          </div>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>🗺️</span>
            <p className={styles.infoText}>
              주소 : {address} {detailAddress}
            </p>
          </div>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>📝</span>
            <p className={styles.infoText}>
              설명 : <br />
              {isExpanded
                ? description
                : `${description && description.slice(0, 100)}...`}
              <button
                onClick={handleExpandClick}
                className={styles.expandButton}
              >
                {isExpanded ? '접기 ▲' : '더 보기 ▼'}
              </button>
            </p>
          </div>
          <DetailPlaceMap latitude={latitude ?? 0} longitude={longitude ?? 0} />
        </div>
      </div>

      {recommandedTravelList && recommandedTravelList.length > 0 ? (
        <div className={styles.recommendedDestinations}>
          <h2 className={styles.chooseRecomend}>
            <Image
              src={favicon}
              alt={'파비콘'}
              style={{ marginLeft: '-15px' }}
              priority
            />
            여행지 탐색 : 추천 여행지
          </h2>
          <StyledSwiperContainer>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={3}
              spaceBetween={20}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              loop
            >
              {recommandedTravelList.map((rec, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.sliderImageContainer}>
                    <Image
                      src={rec.ThumbnailUrl}
                      alt={rec.placeName}
                      width={400}
                      height={300}
                      className={styles.sliderImg}
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <p className={styles.sliderTextP}>{rec.placeName}</p>
                    <p className={styles.sliderTextPDetail}>
                      <Image
                        src={placeIcon}
                        alt={'place'}
                        width={15}
                        height={21}
                      />
                      &nbsp;{rec.country} / {rec.city} / {rec.district}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
              <StyledSwiperButtonPrev className='swiper-button-prev' />
              <StyledSwiperButtonNext className='swiper-button-next' />
            </Swiper>
          </StyledSwiperContainer>
        </div>
      ) : (
        <div className={styles.recommendedDestinations}>
          <h2 className={styles.chooseRecomend}>
            <Image
              src={favicon}
              alt={'파비콘'}
              style={{ marginLeft: '-15px' }}
              priority
            />
            여행지 탐색 : 추천 여행지
          </h2>
          <p className={styles.noRecommendations}>추천 여행지가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TravelDetail;
