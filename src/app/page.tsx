'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from '../styles/onBoard.module.css';
import mainLinkBtn from '../../public/assets/images/메인화면/main_LinkBtn.png';
import HomeImage from '../../public/assets/images/메인화면/ocean_title.png';
import HomePageSearch from '@/components/Feature/Home/HomePageSearch';
import HomePagePopularTravel from '@/components/Feature/Home/HomePagePopularTravel';
import HomePageRecommendTravel from '@/components/Feature/Home/HomePageRecommendTravel';

const Home = () => {
  const router = useRouter();

  const handleScheduleClick = () => {
    router.push('/Schedule');
  };

  const handleTravelClick = () => {
    router.push('/Travel');
  };
  
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
              <span className={styles.textSchedule}>일정</span>을 직접 만들고<br/>
              <span className={styles.textEtc}>여러</span> <span className={styles.textTravel}>여행지</span>를 만나보세요!
              <div className={styles.buttonContainer}>
                <div className={styles.viewBtnSchedule} onClick={handleScheduleClick}>
                  <div className={styles.viewTitle}>일정 만들기</div>
                  <p className={styles.viewTitleSmall}>직접 일정을 만들어보세요!</p>
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
                <div className={styles.viewBtnTravel} onClick={handleTravelClick}>
                  <div className={styles.viewTitle}>여행지 탐색</div>
                  <p className={styles.viewTitleSmall}>여행지 탐색을 통해 여러 여행지를 만나보세요.</p>
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
      <HomePagePopularTravel/>
      <HomePageRecommendTravel/>
    </div>
  );
};
export default Home;
