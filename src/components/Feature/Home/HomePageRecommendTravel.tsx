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
import { homeRecommendTravelList } from '@/apis/Home/homeApi';
import Loading from '@/components/Common/DataLoading';

interface TravelItem {
  placeId: number;
  address: string;
  detailAddress: string | null;
  placeName: string;
  thumbnailUrl: string | null;
}

interface HomeRecommendTravelResponse {
  success: boolean;
  data: {
    content: TravelItem[];
  };
  message?: string;
}

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
  const images: TravelItem[] = [
    {
      placeId: 6,
      address: '서울특별시 강남구 광평로10길 30-71',
      detailAddress: '(일원동)',
      placeName: '대모산도시자연공원',
      thumbnailUrl: null,
    },
    {
      placeId: 8,
      address: '서울특별시 강남구 역삼로90길 43',
      detailAddress: '(대치동)',
      placeName: '대치유수지체육공원',
      thumbnailUrl:
        'https://triptune.s3.ap-northeast-2.amazonaws.com/img/korea/01/240827212046_tourapi_firstimage_86c47da1.jpg',
    },
    {
      placeId: 9,
      address: '서울특별시 강남구 도산대로45길 20',
      detailAddress: null,
      placeName: '도산공원',
      thumbnailUrl: null,
    },
    {
      placeId: 11,
      address: '서울특별시 강남구 개포로109길 74',
      detailAddress: '(개포동)',
      placeName: '마루공원',
      thumbnailUrl: null,
    },
    {
      placeId: 17,
      address: '서울특별시 강남구 삼성동 82',
      detailAddress: null,
      placeName: '삼성해맞이공원',
      thumbnailUrl:
        'https://triptune.s3.ap-northeast-2.amazonaws.com/img/korea/01/240827212052_tourapi_firstimage_b1f617b1.jpg',
    },
  ];
  
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [travelList, setTravelList] = useState<TravelItem[]>(images);
  const [loading, setLoading] = useState<boolean>(false);

  const categoryMapping: Record<string, string> = {
    '전체': 'all',
    '관광지': 'attractions',
    '문화시설': 'culture',
    '레포츠': 'sports',
    '숙박': 'lodging',
    '쇼핑': 'shopping',
    '음식점': 'food',
  };

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    const categoryCode = categoryMapping[category] || 'all';
    setLoading(true);
    const response: HomeRecommendTravelResponse =
      (await homeRecommendTravelList(
        categoryCode
      )) as HomeRecommendTravelResponse;
    setLoading(false);
    if (response.success) {
      setTravelList(response.data.content);
    } else {
      console.error(response.message);
      setTravelList(images);
    }
  };

  useEffect(() => {
    handleCategoryClick('전체');
  }, []);
  
  const handleDetailClick = (placeId: number) => {
    router.push(`/Travel/${placeId}`);
  };

  return (
    <div className={styles.recommendedDestinations}>
      <h2 className={styles.chooseRecomend}>
        <Image src={triptuneIcon} alt='홈화면' width='30' priority />
        추천 여행 테마
      </h2>
      <div>
        {Object.keys(categoryMapping).map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? styles.onBoardChooseBtn
                : styles.onBoardNoChooseBtn
            }
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {loading ? (
        <Loading />
      ) : travelList.length > 0 ? (
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
            {travelList.map((item) => (
              <SwiperSlide key={item.placeId}>
                <div className={styles.imgSliderContainer} onClick={() => handleDetailClick(item.placeId)}>
                  {item.thumbnailUrl ? (
                    <>
                      <Image
                        className={styles.sliderImg}
                        src={item.thumbnailUrl}
                        alt={item.placeName}
                        width={400}
                        height={280}
                      />
                    </>
                  ) : (
                    <div className={styles.noImage}>이미지 없음</div>
                  )}
                  <p className={styles.sliderTextP}>{item.placeName}</p>
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
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default HomePageRecommendTravel;
