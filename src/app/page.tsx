'use client';

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '../styles/onBoard.module.css';
import HomeImage from '../../public/assets/images/메인화면/ocean.jpg';
import searchIcon from '../../public/assets/images/메인화면/main_searchIcon.png';
import locationIcon from '../../public/assets/images/메인화면/main_slideMapIcon.png';
import mainLinkBtn from '../../public/assets/images/메인화면/main_LinkBtn.png';
import pictureImage1 from '../../public/assets/images/메인화면/광화문.jpg';
import pictureImage2 from '../../public/assets/images/메인화면/성산일출봉.jpg';
import pictureImage3 from '../../public/assets/images/메인화면/에펠탑.jpg';
import pictureImage4 from '../../public/assets/images/메인화면/타워브릿지.jpg';
import pictureImage5 from '../../public/assets/images/메인화면/seoul.png';
import triptuneIcon from '../../public/assets/images/로고/triptuneIcon-removebg.png';

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
    background-image: url('/assets/images/메인화면/main_slideLeftBtn.png');
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
    background-image: url('/assets/images/메인화면/main_slideRightBtn.png');
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
      src: pictureImage1,
      alt: '광화문',
      title: '광화문',
      description: '서울 종로구 효자로 12 국립고궁박물관',
    },
    {
      src: pictureImage2,
      alt: '성산일출봉',
      title: '성산일출봉',
      description: '제주 서귀포시 성산읍 성산리 1',
    },
    {
      src: pictureImage3,
      alt: '에펠탑',
      title: '에펠탑',
      description: 'Av. Gustave Eiffel, 75007 Paris France',
    },
    {
      src: pictureImage4,
      alt: '타워브릿지',
      title: '타워브릿지',
      description: 'Tower Bridge Road, London SE1 2UP England',
    },
    {
      src: pictureImage5,
      alt: '서울',
      title: '서울',
      description: '서울',
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
                        src={mainLinkBtn}
                        alt='바로가기'
                        width={50}
                        height={50}
                      />
                    </div>
                    <Image
                      src='/assets/images/메인화면/scheduleIcon.png'
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
                        src={mainLinkBtn}
                        alt='바로가기'
                        width={50}
                        height={50}
                      />
                    </div>
                    <Image
                      src='/assets/images/메인화면/mapIcon.png'
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
          <Image src={triptuneIcon} alt={'홈화면'} width={'30'} priority />
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
