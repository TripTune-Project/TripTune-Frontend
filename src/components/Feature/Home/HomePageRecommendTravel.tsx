import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '@/styles/onBoard.module.css';
import locationIcon from '../../../../public/assets/images/메인화면/main_slideMapIcon.png';
import pictureImage1 from '../../../../public/assets/images/메인화면/광화문.jpg';
import pictureImage2 from '../../../../public/assets/images/메인화면/성산일출봉.jpg';
import pictureImage3 from '../../../../public/assets/images/메인화면/에펠탑.jpg';
import pictureImage4 from '../../../../public/assets/images/메인화면/타워브릿지.jpg';
import pictureImage5 from '../../../../public/assets/images/메인화면/seoul.png';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';

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

const HomePageRecommendTravel = () => {
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
    <>
      <div className={styles.recommendedDestinations}>
        <h2 className={styles.chooseRecomend}>
          <Image src={triptuneIcon} alt={'홈화면'} width={'30'} priority />
          추천 테마 여행
        </h2>
        <button className={styles.onBoardChooseBtn}>전체</button>
        <button className={styles.onBoardNoChooseBtn}>관광지</button>
        <button className={styles.onBoardNoChooseBtn}>문화시설</button>
        <button className={styles.onBoardNoChooseBtn}>레포츠</button>
        <button className={styles.onBoardNoChooseBtn}>숙박</button>
        <button className={styles.onBoardNoChooseBtn}>쇼핑</button>
        <button className={styles.onBoardNoChooseBtn}>음식점</button>
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
    </>
  );
};
export default HomePageRecommendTravel;
