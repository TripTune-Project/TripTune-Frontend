'use client';

import React, { useState, useEffect } from 'react';
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
import ScheduleModal from '@/components/Schedule/ScheduleModal';
import { BookMarkApi, BookMarkDeleteApi } from '@/api/bookMarkApi';

const StyledSwiperContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 1850px;
  margin: 0 auto;
`;

const TravelDetail = () => {
  const router = useRouter();
  const { placeId } = useParams();
  const placeIdNumber = parseInt(placeId as string, 10);
  const { data, isLoading, error } = useTravelDetail(placeIdNumber);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        // TODO : 초기 렌더링 시 현재 장소가 북마크에 등록되어 있는지 확인하는 API 호출
        // TODO : 서버로부터 받은 북마크 상태에 따라 true or false 설정
        // const response = await getBookmarkStatus(placeIdNumber);
        // setIsBookmarked(response?.data?.isBookmarked);
        // setIsBookmarked(true or false);
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
  } = data?.data || {};

  return (
    <div className={styles.travelDetailContent}>
      <h1 className={styles.travelSearchDetail}>
        여행지 탐색 : {placeName} 상세보기
      </h1>
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
              </Swiper>
            ) : (
              <div className={styles.noImage}>이미지가 없습니다.</div>
            )}
          </StyledSwiperContainer>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.infoSection}>
            <span className={styles.infoIcon}>📍</span>
            <p className={styles.infoText}>
              {country} / {city} / {district}
            </p>
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
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            뒤로 가기
          </button>
          <button className={styles.ChooseBtn} onClick={openModal}>
            내 일정 담기
          </button>
          <ScheduleModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleSchedule}
          />
          <button className={styles.bookmarkBtn} onClick={toggleBookmark}>
            {isBookmarked ? '북마크 해제' : '북마크'}
          </button>
        </div>
        <DetailPlaceMap latitude={latitude ?? 0} longitude={longitude ?? 0} />
      </div>
    </div>
  );
};

export default TravelDetail;
