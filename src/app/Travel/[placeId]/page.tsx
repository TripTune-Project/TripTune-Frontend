'use client';

import Head from 'next/head';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '../../../styles/Travel.module.css';
import DataLoading from '@/components/Common/DataLoading';
import DetailPlaceMap from '@/components/Travel/DetailPlaceMap';
import { BookMarkApi, BookMarkDeleteApi } from '@/api/bookMarkApi';
import styled from 'styled-components';
import detailBookMarkNo from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_bookmarkIcon.png';
import detailBookMark from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_bookmarkIconFill.png';
import scheduleIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_scheduleIcon.png';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';
import locationIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_mapIcon.png';
import timeIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_timeIcon.png';
import homePageIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_homepageIcon.png';
import phoneIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_phoneIcon.png';
import { fetchTravelDetail } from '@/api/travelApi';
import { useState, useEffect } from 'react';

const StyledSwiperContainer = styled.div`
  position: relative;
  width: 749px;
  height: 512px;
`;

const StyledSwiperButtonPrev = styled.button`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  z-index: 10;
  user-select: none;

  &::after {
    content: '';
    display: block;
    width: 20px;
    height: 30px;
    background-repeat: no-repeat;
    background-image: url('/assets/images/여행지 탐색/상세화면/placeDetail_imageLeftBtn.png');
  }
`;

const StyledSwiperButtonNext = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  z-index: 10;
  user-select: none;

  &::after {
    content: '';
    display: block;
    width: 20px;
    height: 30px;
    background-repeat: no-repeat;
    background-image: url('/assets/images/여행지 탐색/상세화면/placeDetail_imageRightBtn.png');
  }
`;

interface TravelPlaceDetail {
  placeName: string;
  country: string;
  city: string;
  district: string;
  address: string;
  description: string;
  imageList: { imageUrl: string; imageName: string }[];
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  homepage?: string;
  useTime?: string;
}

interface TravelDetailPageProps {
  params: { placeId: string };
}

const TravelDetailPage = ({ params }: TravelDetailPageProps) => {
  const placeIdNumber = parseInt(params.placeId, 10);
  const [data, setData] = useState<TravelPlaceDetail | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchTravelDetail(placeIdNumber);
      if (result.success && result.data) {
        setData(result.data);
      } else {
        console.error(`Error: ${result.message}`);
      }
    };
    fetchData();
  }, [placeIdNumber]);

  const toggleBookmark = async () => {
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await BookMarkDeleteApi({ placeId: placeIdNumber });
        setIsBookmarked(false);
      } else {
        await BookMarkApi({ placeId: placeIdNumber });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('북마크 처리 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleAdd = () => {
    console.log('내 일정에 추가되었습니다.');
  };

  if (!data) return <DataLoading />;

  const {
    placeName,
    country,
    city,
    district,
    address,
    description,
    imageList,
    latitude,
    longitude,
    phoneNumber,
    homepage,
    useTime,
  } = data;

  const extractHomepageUrl = (htmlString: string) => {
    if (!htmlString) return '';
    const urlMatch = htmlString.match(/href="([^"]*)"/);
    return urlMatch ? urlMatch[1] : '';
  };

  const homepageUrl = homepage ? extractHomepageUrl(homepage) : '';

  return (
    <>
      <Head>
        <title>{placeName} - 여행지 상세 정보</title>
        <meta
          name='description'
          content={`${placeName}의 상세 정보를 확인하세요.`}
        />
        <meta property='og:title' content={`${placeName} - 여행지 상세 정보`} />
      </Head>
      <div className={styles.travelDetailContent}>
        <div className={styles.topSection}>
          {imageList && imageList.length > 0 ? (
            <StyledSwiperContainer>
              <Swiper modules={[Navigation, Pagination]} slidesPerView={1} loop>
                {imageList.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.sliderImageContainer}>
                      <Image
                        src={image.imageUrl}
                        alt={image.imageName}
                        layout='responsive'
                        width={749}
                        height={512}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <StyledSwiperButtonPrev />
              <StyledSwiperButtonNext />
            </StyledSwiperContainer>
          ) : (
            <div className={styles.noImage}>이미지가 없습니다.</div>
          )}
          <div className={styles.rightSection}>
            <p className={styles.countryCityDistrict}>
              {country} &gt; {city} &gt; {district}
            </p>
            <div className={styles.detailplaceName}>{placeName}</div>
            <div className={styles.addressLabel}>
              <Image width={14} height={21} src={locationIcon} alt={'주소'} />
              <p> 주소 </p> {address}
            </div>
            {useTime && (
              <div className={styles.useTimeLabel}>
                <Image
                  width={18}
                  height={18}
                  src={timeIcon}
                  alt={'이용 시간'}
                />
                <p> 이용 시간</p> {useTime}
              </div>
            )}
            {homepageUrl && (
              <div className={styles.homepageLabel}>
                <Image
                  width={18}
                  height={18}
                  src={homePageIcon}
                  alt='홈페이지'
                />
                <a href={homepageUrl} target='_blank' rel='noopener noreferrer'>
                  {homepageUrl}
                </a>
              </div>
            )}
            {phoneNumber && (
              <div className={styles.phoneLabel}>
                <Image
                  width={36}
                  height={28}
                  src={phoneIcon}
                  alt={'문의 및 안내'}
                />
                <p> 문의 및 안내 </p> {phoneNumber}
              </div>
            )}
            <div className={styles.buttonContainer}>
              <button
                onClick={toggleBookmark}
                className={styles.bookmarkBtn}
                disabled={isLoading}
              >
                <Image
                  width={13}
                  height={17}
                  src={isBookmarked ? detailBookMark : detailBookMarkNo}
                  alt='북마크'
                />
                {isBookmarked ? '북마크 해제' : '북마크'}
              </button>
              <button onClick={handleScheduleAdd} className={styles.chooseBtn}>
                <Image
                  width={25}
                  height={21}
                  src={scheduleIcon}
                  alt='일정 등록'
                />
                내 일정 담기
              </button>
            </div>
          </div>
        </div>
        <h2 className={styles.detailTitle}>
          <Image
            className={styles.detailTitleIcon}
            src={triptuneIcon}
            alt='상세 설명'
          />
          상세 설명
        </h2>
        <div className={styles.infoSection}>
          <p className={styles.infoText}>{description}</p>
        </div>
        <DetailPlaceMap latitude={latitude ?? 0} longitude={longitude ?? 0} />
      </div>
      {isLoading && <DataLoading />}
    </>
  );
};

export default TravelDetailPage;
