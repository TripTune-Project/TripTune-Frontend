'use client';

import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import DataLoading from '@/components/Common/DataLoading';
import DetailPlaceMap from '@/components/Travel/DetailPlaceMap';
import styled from 'styled-components';
import { fetchTravelDetail } from '@/api/travelApi';

import detailBookMarkNo from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_bookmarkIcon.png';
import detailBookMark from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_bookmarkIconFill.png';
import scheduleIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_scheduleIcon.png';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';
import locationIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_mapIcon.png';
import timeIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_timeIcon.png';
import homePageIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_homepageIcon.png';
import phoneIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_phoneIcon.png';

const StyledSwiperContainer = styled.div`
  position: relative;
  width: 749px;
  height: 512px;
`;

type ImageInfo = {
  imageUrl: string;
  imageName: string;
};

type TravelDetailData = {
  placeName?: string;
  country?: string;
  city?: string;
  district?: string;
  address?: string;
  description?: string;
  imageList?: ImageInfo[];
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  homepage?: string;
  useTime?: string;
  isBookmarked?: boolean;
};

type TravelDetailProps = {
  params: { scheduleId: string };
};

const TravelDetailPage = async ({ params }: TravelDetailProps) => {
  const { scheduleId } = params;
  const response = await fetchTravelDetail(Number(scheduleId));

  if (!response.success) {
    return <p>Error: 데이터 로딩 실패</p>;
  }

  const data = response.data;

  return (
    <>
      <Head>
        <title>{data?.placeName} - 여행지 상세 정보</title>
      </Head>
      <ClientContent {...data} />
    </>
  );
};

type ClientContentProps = TravelDetailData;

const ClientContent = ({
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
  isBookmarked: initialBookmarkState,
}: ClientContentProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarkState);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);

  const toggleBookmark = () => setIsBookmarked((prev) => !prev);

  return (
    <div>
      <StyledSwiperContainer>
        {imageList && imageList.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            navigation={{
              nextEl: nextRef.current,
              prevEl: prevRef.current,
            }}
            loop
          >
            {imageList.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={image.imageUrl}
                  alt={image.imageName}
                  width={749}
                  height={512}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <DataLoading />
        )}
      </StyledSwiperContainer>
      <div>
        <p>
          <Image
            src={locationIcon}
            alt='Location icon'
            width={14}
            height={21}
          />
          {country} &gt; {city} &gt; {district}
        </p>
        <h1>{placeName}</h1>
        <p>{address}</p>
        <p>
          <Image src={timeIcon} alt='Time icon' width={18} height={18} />
          {useTime}
        </p>
        <p>
          <Image src={phoneIcon} alt='Phone icon' width={18} height={18} />
          {phoneNumber}
        </p>
        <p>
          <Image
            src={homePageIcon}
            alt='Homepage icon'
            width={18}
            height={18}
          />
          <a href={homepage} target='_blank' rel='noopener noreferrer'>
            {homepage}
          </a>
        </p>
        <button onClick={toggleBookmark}>
          <Image
            src={isBookmarked ? detailBookMark : detailBookMarkNo}
            alt='Bookmark icon'
            width={13}
            height={17}
          />
          {isBookmarked ? '북마크 해제' : '북마크'}
        </button>
        <button>
          <Image
            src={scheduleIcon}
            alt='Schedule icon'
            width={25}
            height={21}
          />
          내 일정 담기
        </button>
      </div>
      <h2>
        <Image src={triptuneIcon} alt='Triptune icon' />
        상세 설명
      </h2>
      <p>{description}</p>
      <DetailPlaceMap latitude={latitude ?? 0} longitude={longitude ?? 0} />
    </div>
  );
};

export default TravelDetailPage;
