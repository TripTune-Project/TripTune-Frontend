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
import { refreshApi } from '@/apis/Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';
import useAuth from '@/hooks/useAuth';

const Home = () => {
  const router = useRouter();
  const { updateAuthStatus } = useAuth();
  const { getDecryptedCookie, setEncryptedCookie } = saveLocalContent();

  // 소셜 로그인 후 사용자 정보 가져오기
  useEffect(() => {
    const checkSocialLogin = async () => {
      try {
        const refreshToken = getDecryptedCookie('trip-tune_rt');
        const nickname = getDecryptedCookie('nickname');

        // TODO : 리프레시 토큰은 있지만 닉네임이 없는 경우 (소셜 로그인 직후)
        if (refreshToken && !nickname) {
          console.log('소셜 로그인 후 사용자 정보 가져오기 시도');
          const { nickname: newNickname } = await refreshApi();
          if (newNickname) {
            setEncryptedCookie('nickname', newNickname, 7);
            updateAuthStatus(true);
          }
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    };

    checkSocialLogin();
  }, [getDecryptedCookie, setEncryptedCookie, updateAuthStatus]);

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
              <div className={styles.homepageSearchLayout}>
                <HomePageSearch />
              </div>
            </div>
          </div>
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
                      width={98}
                      height={82}
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
                    여행지 탐색을 통해 여러 여행지를 만나보세요.
                  </p>
                  <div className={styles.iconContainer}>
                    <Image
                      src={travelIcon}
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
      <HomePagePopularTravel />
      <HomePageRecommendTravel />
    </div>
  );
};

export default Home;
