import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

/**
 * 여행지 아이템 인터페이스
 */
interface TravelItem {
  placeId: number;
  address: string;
  detailAddress: string;
  placeName: string;
  thumbnailUrl: string | null;
}

/**
 * API 응답 인터페이스
 */
interface HomePopularTravelResponse {
  success: boolean;
  data: TravelItem[];
  message?: string;
}

/**
 * 스와이퍼 컨테이너 스타일 컴포넌트
 */
const StyledSwiperContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 1356px;
  margin: 0 auto;
  padding: 0;
`;

/**
 * 이전 버튼 스타일 컴포넌트
 */
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

/**
 * 다음 버튼 스타일 컴포넌트
 */
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

/**
 * HomePagePopularTravel 컴포넌트 - 홈페이지 인기 여행지 섹션 구현
 * 주요 기능:
 * - 지역별 인기 여행지 필터링 및 표시
 * - 스와이퍼를 통한 여행지 목록 슬라이드 구현
 * - 여행지 상세 페이지로 이동 기능 제공
 */
const HomePagePopularTravel = () => {
  const router = useRouter();
  // 선택된 도시 상태
  const [selectedCity, setSelectedCity] = useState<string>('전체');
  // 여행지 목록 상태
  const [travelList, setTravelList] = useState<TravelItem[]>([]);
  // 로딩 상태
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 도시 이름과 API 요청 코드 매핑 객체
   */
  const cityMapping = useMemo(
    () => ({
      전체: 'all',
      서울: 'seoul',
      부산: 'busan',
      제주: 'jeju',
      경기: 'gyeonggi',
      강원: 'gangwon',
      경상: 'gyeongsang',
      전라: 'jeolla',
      충청: 'chungcheong',
    }),
    []
  ) as Record<string, string>;

  /**
   * 도시 버튼 클릭 핸들러
   * @param city 선택된 도시 이름
   */
  const handleCityClick = useCallback(
    async (city: string) => {
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
    },
    [cityMapping]
  );

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    handleCityClick('전체');
  }, [handleCityClick]);

  /**
   * 여행지 상세 페이지로 이동하는 핸들러
   * @param placeId 여행지 ID
   */
  const handleDetailClick = (placeId: number) => {
    router.push(`/Travel/${placeId}`);
  };

  return (
    <div className={styles.recommendedDestinations}>
      {/* 인기 여행지 제목 */}
      <h2 className={styles.chooseRecomend}>
        <Image src={triptuneIcon} alt='홈화면' width='30' priority />
        인기 여행지
      </h2>

      {/* 지역 선택 버튼 그룹 */}
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

      {/* 여행지 목록 표시 영역 */}
      {loading ? (
        <Loading />
      ) : travelList.length > 0 ? (
        <StyledSwiperContainer>
          {/* 여행지 슬라이더 */}
          <Swiper
            style={{ overflow: 'visible' }}
            modules={[Navigation, Pagination]}
            slidesPerView={4}
            spaceBetween={25}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            loop
          >
            {/* 여행지 아이템 목록 */}
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
                        width={305}
                        height={203}
                      />
                    </>
                  ) : (
                    <div className={styles.noImage}>이미지 없음</div>
                  )}
                  <p className={styles.sliderTextP}>
                    {truncateText(item.placeName, 21)}
                  </p>
                  <p className={styles.sliderTextPDetail}>
                    <Image
                      src={locationIcon}
                      alt='장소'
                      width={15}
                      height={21}
                    />
                    {truncateText(
                      `${item.address} ${item.detailAddress ?? ''}`,
                      21
                    )}
                  </p>
                </div>
              </SwiperSlide>
            ))}
            {/* 네비게이션 버튼 */}
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
