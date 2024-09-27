'use client';

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styled from 'styled-components';
import HomeImage from '../../public/assets/images/HomeImage.png';
import favicon from '../../public/assets/favicon.ico';
import styles from '../styles/onBoard.module.css';
import searchIcon from '../../public/assets/icons/ic_search.png';
import locationIcon from '../../public/assets/icons/ic_location.png';
import pictureImage from '../../public/assets/images/pictureImage.png';

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
    background-image: url('/assets/images/leftBtnImage.png');
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
    background-image: url('/assets/images/rightBtnImage.png');
  }
`;
const Home = () => {
  const router = useRouter();

  const handleScheduleClick = () => {
    router.push('/Schedule');
  };

  const handleTravelClick = () => {
    router.push('/Travel');
  };

  const handleSearch = () => {
    router.push('/Search');
  };

  const images = [
    {
      src: pictureImage,
      alt: '경복궁',
      title: '경복궁',
      description: '서울 종로구 경복궁',
    },
    {
      src: pictureImage,
      alt: '남산타워',
      title: '남산타워',
      description: '서울 용산구 남산타워',
    },
    {
      src: pictureImage,
      alt: '한라산',
      title: '한라산',
      description: '제주 서귀포시 한라산',
    },
    {
      src: pictureImage,
      alt: '해운대 해수욕장',
      title: '해운대 해수욕장',
      description: '부산 해운대구 해운대 해수욕장',
    },
    {
      src: pictureImage,
      alt: '동대문 디자인 플라자',
      title: '동대문 디자인 플라자',
      description: '서울 중구 동대문 디자인 플라자',
    },
  ];

  return (
    <div className={styles.onBoard}>
      <Head>
        <title>TripTune - Explore and Plan Your Travel</title>
        <meta
          name='description'
          content='Discover top travel destinations and plan your trips with TripTune. Start your journey with personalized travel plans and recommendations.'
        />
        <meta
          name='keywords'
          content='travel, trip planning, explore destinations, TripTune, travel ideas, itinerary'
        />
        <meta
          property='og:title'
          content='TripTune - Explore and Plan Your Travel'
        />
        <meta
          property='og:description'
          content='Discover top travel destinations and plan your trips with TripTune. Start your journey with personalized travel plans and recommendations.'
        />
        <meta property='og:image' content='/assets/Logo.png' />
        <meta property='og:url' content='https://triptune.netlify.app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.onBoardingTop}>
        <div className={styles.onBoardingView}>
          <Image
            className={styles.onBoardingImg}
            src={HomeImage}
            alt='온보딩 이미지'
            objectFit='cover'
            priority
          />
          <div className={styles.onBoardingContent}>
            <div className={styles.onBoardingText}>
              <div className={styles.onBoardingExplainDiv}>
                모두의 아이디어로 완성되는 여행
              </div>
              <p className={styles.onBoardingExplainP}>
                TripTune과 함께 즐겁고 새로운 여행 계획을 세워보세요.
              </p>
            </div>
            <div className={styles.onBoardingShow}>
              <div className={styles.onBoardingSearch}>
                <input
                  type='text'
                  placeholder='원하는 여행지를 검색하세요'
                  className={styles.searchInput}
                />
                <button className={styles.searchButton} onClick={handleSearch}>
                  <Image
                    src={searchIcon}
                    alt='돋보기 아이콘'
                    width={20}
                    height={20}
                    style={{ marginLeft: '30px' }}
                  />
                </button>
              </div>
              <div className={styles.buttonContainer}>
                <div className={styles.viewBtn} onClick={handleScheduleClick}>
                  <div className={styles.viewTitle}>일정 만들기</div>
                  <br />
                  <div className={styles.iconContainer}>
                    <div className={styles.goLink}>
                      <Image
                        src='/assets/images/go.png'
                        alt='바로가기'
                        width={50}
                        height={50}
                      />
                    </div>
                    <Image
                      src='/assets/images/time.png'
                      className={styles.time}
                      alt='일정 만들기'
                      width={98}
                      height={82}
                    />
                  </div>
                </div>
                <div className={styles.viewBtn} onClick={handleTravelClick}>
                  <div className={styles.viewTitle}>여행지 탐색</div>
                  <br />
                  <div className={styles.iconContainer}>
                    <div className={styles.goLink}>
                      <Image
                        src='/assets/images/go.png'
                        alt='바로가기'
                        width={50}
                        height={50}
                      />
                    </div>
                    <Image
                      src='/assets/images/travel.png'
                      className={styles.travel}
                      alt='여행지 탐색'
                      width={98}
                      height={82}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.recommendedDestinations}>
        <h2 className={styles.chooseRecomend}>
          <Image
            src={favicon}
            alt={'파비콘'}
            style={{ marginLeft: '-15px' }}
            priority
          />
          추천 여행지
        </h2>
        <button className={styles.onBoardChooseBtn}>전체</button>
        <button className={styles.onBoardNoChooseBtn}>국내</button>
        <button className={styles.onBoardNoChooseBtn}>해외</button>
        <button className={styles.onBoardChooseBtnMore}>더보기</button>
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
                  <Image
                    className={styles.sliderImg}
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={280}
                  />
                  <p className={styles.sliderTextP}>{image.title}</p>
                  <p className={styles.sliderTextPDetail}>
                    <Image
                      src={locationIcon}
                      alt={'장소'}
                      width={15}
                      height={21}
                    />
                    &nbsp;
                    {image.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
            <StyledSwiperButtonPrev className='swiper-button-prev' />
            <StyledSwiperButtonNext className='swiper-button-next' />
          </Swiper>
        </StyledSwiperContainer>
      </div>
    </div>
  );
};
export default Home;
