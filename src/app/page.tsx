'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from '@/styles/onBoard.module.css';
import HomeImage from '../../public/assets/images/메인화면/ocean_title.png';
import HomePageSearch from '@/components/Feature/Home/HomePageSearch';
import HomePagePopularTravel from '@/components/Feature/Home/HomePagePopularTravel';
import HomePageRecommendTravel from '@/components/Feature/Home/HomePageRecommendTravel';

/**
 * Home 컴포넌트 - 메인 페이지를 구성하는 루트 컴포넌트
 * 주요 기능:
 * - 메인 배너 및 검색 기능 제공
 * - 일정 만들기 및 여행지 탐색 버튼 제공
 * - 인기 여행지 및 추천 여행지 표시
 */
const Home = () => {
  const router = useRouter();

  // 일정 페이지로 이동하는 핸들러
  const handleScheduleClick = () => {
    router.push('/Schedule');
  };

  // 여행지 페이지로 이동하는 핸들러
  const handleTravelClick = () => {
    router.push('/Travel');
  };

  // 버튼 아이콘 상태 관리
  const [scheduleIcon, setScheduleIcon] = useState(
    '/assets/images/메인화면/scheduleIcon.png'
  );
  const [travelIcon, setTravelIcon] = useState(
    '/assets/images/메인화면/travelIcon.png'
  );

  // 페이지 로드 시 overflow 스타일 설정
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  return (
    <div className={styles.onBoard}>
      {/* SEO 및 메타 태그 설정 */}
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
        <meta property='og:url' content='https://www.triptune.site' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* 메인 배경 및 중앙 컨텐츠 */}
      <div className={styles.heroSection}>
        <div className={styles.heroTextArea}>
          <div className={styles.heroTitle}>모두의 아이디어로 완성되는 여행</div>
          <div className={styles.heroSubtitle}><b>TripTune</b>과 함께 즐겁고 새로운 여행 계획을 세워보세요.</div>
        </div>
        <div className={styles.heroContentBox}>
          <HomePageSearch />
        </div>
      </div>

      {/* 주요 기능 버튼 영역 - 이미지 아래로 분리 */}
      <div className={styles.onBoardingButtonLayout}>
        <div className={styles.textContent}>
          <span className={styles.textSchedule}>일정</span>을 직접 만들고
          <br />
          <span className={styles.textEtc}>여러</span>{' '}
          <span className={styles.textTravel}>여행지</span>를 만나보세요!
          <div className={styles.buttonContainer}>
            {/* 일정 만들기 버튼 */}
            <div
              className={styles.viewBtnSchedule}
              onClick={handleScheduleClick}
              onMouseEnter={() =>
                setScheduleIcon(
                  '/assets/images/메인화면/selectScheduleIcon.png'
                )
              }
              onMouseLeave={() =>
                setScheduleIcon('/assets/images/메인화면/scheduleIcon.png')
              }
            >
              <div className={styles.viewTitle}>일정 만들기</div>
              <p className={styles.viewTitleSmall}>
                직접 일정을 만들어보세요!
              </p>
              <div className={styles.iconContainer}>
                <Image
                  src={scheduleIcon}
                  className={styles.time}
                  alt='일정 만들기'
                  width={68}
                  height={56}
                />
              </div>
            </div>
            {/* 여행지 탐색 버튼 */}
            <div
              className={styles.viewBtnTravel}
              onClick={handleTravelClick}
              onMouseEnter={() =>
                setTravelIcon(
                  '/assets/images/메인화면/selectTravelIcon.png'
                )
              }
              onMouseLeave={() =>
                setTravelIcon('/assets/images/메인화면/travelIcon.png')
              }
            >
              <div className={styles.viewTitle}>여행지 탐색</div>
              <p className={styles.viewTitleSmall}>
                여행지 탐색으로 여러 여행지를<br/>만나보세요.
              </p>
              <div className={styles.iconContainer}>
                <Image
                  src={travelIcon}
                  className={styles.travel}
                  alt='여행지 탐색'
                  width={68}
                  height={56}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 인기 여행지 컴포넌트 */}
      <HomePagePopularTravel />

      {/* 추천 여행지 컴포넌트 */}
      <HomePageRecommendTravel />
    </div>
  );
};

export default Home;
