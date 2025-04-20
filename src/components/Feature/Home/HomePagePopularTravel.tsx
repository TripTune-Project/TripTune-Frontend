import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '@/styles/onBoard.module.css';
import locationIcon from '../../../../public/assets/images/메인화면/main_slideMapIcon.png';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';
import { homePopularTravelList } from '@/apis/Home/homeApi';
import Loading from '@/components/Common/DataLoading';
import { truncateText } from '@/utils';

interface TravelItem {
  placeId: number;
  address: string;
  detailAddress: string;
  placeName: string;
  thumbnailUrl: string | null;
}

interface HomePopularTravelResponse {
  success: boolean;
  data: TravelItem[];
  message?: string;
}

const StyledSwiperContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 1850px;
  margin: 0 auto;
  padding: 0 30px;
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
  right: -20px;
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

const HomePagePopularTravel = () => {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>('전체');
  const [travelList, setTravelList] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const cityMapping: Record<string, string> = {
    전체: 'all',
    서울: 'seoul',
    부산: 'busan',
    제주: 'jeju',
    경기: 'gyeonggi',
    강원: 'gangwon',
    경상: 'gyeongsang',
    전라: 'jeolla',
    충청: 'chungcheong',
  };

  const handleCityClick = async (city: string) => {
    setSelectedCity(city);
    const cityCode = cityMapping[city] || 'all';
    setLoading(true);
    const response: HomePopularTravelResponse = (await homePopularTravelList(
      cityCode
    )) as HomePopularTravelResponse;
    setLoading(false);
    if (response.success) {
      setTravelList(response.data);
    } else {
      console.error(response.message);
      setTravelList([]);
    }
  };

  useEffect(() => {
    handleCityClick('전체');
  }, []);

  const handleDetailClick = (placeId: number) => {
    router.push(`/Travel/${placeId}`);
  };

  return (
    <div className={styles.recommendedDestinations}>
      <h2 className={styles.chooseRecomend}>
        <Image src={triptuneIcon} alt='홈화면' width='30' priority />
        인기 여행지
      </h2>
      <div className={styles.onBoardChips}>
        {Object.keys(cityMapping).map((city) => (
          <button
            key={city}
            className={
              selectedCity === city
                ? styles.onBoardChooseBtn
                : styles.onBoardNoChooseBtn
            }
            onClick={() => handleCityClick(city)}
          >
            {city}
          </button>
        ))}
      </div>
      {loading ? (
        <Loading />
      ) : travelList.length > 0 ? (
        <StyledSwiperContainer>
          <Swiper
            style={{ overflow: 'visible' }}
            modules={[Navigation, Pagination]}
            slidesPerView={4}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            loop
          >
            {travelList.map((item) => (
              <SwiperSlide key={item.placeId}>
                <div
                  className={styles.imgSliderContainer}
                  onClick={() => handleDetailClick(item.placeId)}
                >
                  {item.thumbnailUrl ? (
                    <>
                      <Image
                        className={styles.sliderImg}
                        src={item.thumbnailUrl}
                        alt={item.placeName}
                        width={295}
                        height={203}
                      />
                    </>
                  ) : (
                    <div className={styles.noImage}>이미지 없음</div>
                  )}
                  <p className={styles.sliderTextP}>
                    {truncateText(item.placeName, 10)}
                  </p>
                  <p className={styles.sliderTextPDetail}>
                    <Image
                      src={locationIcon}
                      alt='장소'
                      width={15}
                      height={21}
                    />
                    &nbsp;{item.address} {item.detailAddress}
                  </p>
                </div>
              </SwiperSlide>
            ))}
            <StyledSwiperButtonPrev className='swiper-button-prev' />
            <StyledSwiperButtonNext className='swiper-button-next' />
          </Swiper>
        </StyledSwiperContainer>
      ) : (
        !loading && <p className={styles.noData}>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default HomePagePopularTravel;
