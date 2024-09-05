'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styled from 'styled-components';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '../../../styles/Travel.module.css';
import favicon from '../../../../public/favicon.ico';
import place from '../../../../public/assets/images/place.png';
import picture from '../../../../public/assets/images/picture.png';

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

const images = [
  { src: picture, alt: '경복궁', title: '경복궁', description: '서울 종로구 경복궁' },
  { src: picture, alt: '남산타워', title: '남산타워', description: '서울 용산구 남산타워' },
  { src: picture, alt: '한라산', title: '한라산', description: '제주 서귀포시 한라산' },
  { src: picture, alt: '해운대 해수욕장', title: '해운대 해수욕장', description: '부산 해운대구 해운대 해수욕장' },
  { src: picture, alt: '동대문 디자인 플라자', title: '동대문 디자인 플라자', description: '서울 중구 동대문 디자인 플라자' },
];

const TravelDetail = () => {
  return (
    <div className={styles.travelDetailContent}>
      <h1 className={styles.chooseRecomend}>여행지 탐색 : 상세보기</h1>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <StyledSwiperContainer>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              loop
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image src={image.src} alt={image.alt} width={400} height={280} className={styles.detailSliderImg} />
                </SwiperSlide>
              ))}
              <StyledSwiperButtonPrev className="swiper-button-prev" />
              <StyledSwiperButtonNext className="swiper-button-next" />
            </Swiper>
          </StyledSwiperContainer>
        </div>
        <div className={styles.rightSection}>
          <p className={styles.country}>country : 한국</p>
          <p className={styles.city}>city : 서울</p>
          <p className={styles.district}>district : 영등포구</p>
          <p className={styles.placeName}>placeName: 여의도 한강공원</p>
          <p className={styles.address}>
            address: 서울 영등포구 여의동로 330 한강사업본부 여의도안내센터
          </p>
          <p className={styles.description}>
            description: 여행지에 대한 설명입니다.
          </p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.backBtn}>뒤로 가기</button>
        <button className={styles.ChooseBtn}>내 일정 담기</button>
        <button className={styles.bookmarkBtn}>북마크</button>
      </div>
      <div className={styles.recommendedDestinations}>
        <h2 className={styles.chooseRecomend}>
          <Image src={favicon} alt={'파비콘'} style={{ marginLeft: '-15px' }} priority />
          여행지 탐색 : 추천 여행지
        </h2>
        <StyledSwiperContainer>
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={4}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            loop
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className={styles.imgSliderContainer}>
                  <Image src={image.src} alt={image.alt} width={400} height={280} className={styles.sliderImg} />
                  <p className={styles.sliderTextP}>{image.title}</p>
                  <p className={styles.sliderTextPDetail}>
                    <Image src={place} alt={'place'} width={15} height={21} />
                    &nbsp;{image.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
            <StyledSwiperButtonPrev className="swiper-button-prev" />
            <StyledSwiperButtonNext className="swiper-button-next" />
          </Swiper>
        </StyledSwiperContainer>
      </div>
    </div>
  );
};

export default TravelDetail;
