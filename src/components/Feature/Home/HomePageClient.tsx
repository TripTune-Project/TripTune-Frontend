'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from '@/styles/onBoard.module.css';
import HomePageSearch from '@/components/Feature/Home/HomePageSearch';

const HomePagePopularTravel = dynamic(
  () => import('@/components/Feature/Home/HomePagePopularTravel')
);
const HomePageRecommendTravel = dynamic(
  () => import('@/components/Feature/Home/HomePageRecommendTravel')
);

const HomePageClient = () => {
  const router = useRouter();

  const handleScheduleClick = () => {
    router.push('/Schedule');
  };

  const handleTravelClick = () => {
    router.push('/Travel');
  };

  const [scheduleIcon, setScheduleIcon] = useState(
    '/assets/images/메인화면/scheduleIcon.png'
  );
  const [travelIcon, setTravelIcon] = useState(
    '/assets/images/메인화면/travelIcon.png'
  );

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  return (
    <div className={styles.onBoard}>
      <div className={styles.heroSection}>
        <Image
          src='/assets/images/메인화면/ocean_title.png'
          alt='메인 배경 이미지'
          fill
          priority
          sizes='100vw'
          style={{ objectFit: 'cover', zIndex: 0 }}
        />
        <div className={styles.heroTextArea}>
          <div className={styles.heroTitle}>모두의 아이디어로 완성되는 여행</div>
          <div className={styles.heroSubtitle}><b>TripTune</b>과 함께 즐겁고 새로운 여행 계획을 세워보세요.</div>
        </div>
        <div className={styles.heroContentBox}>
          <HomePageSearch />
        </div>
      </div>

      <div className={styles.onBoardingButtonLayout}>
        <div className={styles.textContent}>
          <span className={styles.textSchedule}>일정</span>을 직접 만들고
          <br />
          <span>여러</span>{' '}
          <span className={styles.textTravel}>여행지</span>를 만나보세요!
          <div className={styles.buttonContainer}>
            <div
              className={styles.viewBtnSchedule}
              onClick={handleScheduleClick}
              onMouseEnter={() =>
                setScheduleIcon('/assets/images/메인화면/selectScheduleIcon.png')
              }
              onMouseLeave={() =>
                setScheduleIcon('/assets/images/메인화면/scheduleIcon.png')
              }
            >
              <div className={styles.viewTitle}>일정 만들기</div>
              <p className={styles.viewTitleSmall}>직접 일정을 만들어보세요!</p>
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
            <div
              className={styles.viewBtnTravel}
              onClick={handleTravelClick}
              onMouseEnter={() =>
                setTravelIcon('/assets/images/메인화면/selectTravelIcon.png')
              }
              onMouseLeave={() =>
                setTravelIcon('/assets/images/메인화면/travelIcon.png')
              }
            >
              <div className={styles.viewTitle}>여행지 탐색</div>
              <p className={styles.viewTitleSmall}>
                여행지 탐색으로 여러 여행지를<br />만나보세요.
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

      <HomePagePopularTravel />
      <HomePageRecommendTravel />
    </div>
  );
};

export default HomePageClient;
