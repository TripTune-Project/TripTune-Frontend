'use client';

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '../../../styles/Travel.module.css';
import { useTravelDetail } from '@/hooks/useTravel';
import { useParams } from 'next/navigation';
import DataLoading from '@/components/Common/DataLoading';
import DetailPlaceMap from '@/components/Travel/DetailPlaceMap';
import { BookMarkApi, BookMarkDeleteApi } from '@/api/bookMarkApi';
import styled from 'styled-components';
import detailBookMarkNo from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_bookmarkIcon.png';
import detailBookMark from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_bookmarkIconFill.png';
import scheduleIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_timeIcon.png';
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

const StyledSwiperButtonPrev = styled.button`
    background-color: #000000;
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
        background-image: url('/assets/images/detailLeftBtnImage.png');
    }
`;

const StyledSwiperButtonNext = styled.button`
    background-color: #000000;
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
        background-image: url('/assets/images/detailRightBtnImage.png');
    }
`;

const TravelDetail = () => {
  const { placeId } = useParams();
  const placeIdNumber = parseInt(placeId as string, 10);
  const { data, isLoading, error } = useTravelDetail(placeIdNumber);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showExpandButton, setShowExpandButton] = useState(false);
  
  const nextRef = useRef(null);
  const prevRef = useRef(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  
  useEffect(() => {
    if (descriptionRef.current) {
      requestAnimationFrame(() => {
        const descriptionElement = descriptionRef.current;
        
        if (descriptionElement) {
          const style = getComputedStyle(descriptionElement);
          const lineHeight = parseFloat(style.lineHeight) || 20;
          const scrollHeight = descriptionElement.scrollHeight;
          
          if (!isNaN(lineHeight)) {
            const lineCount = scrollHeight / lineHeight;
            
            if (lineCount > 3) {
              setShowExpandButton(true);
            } else {
              setShowExpandButton(false);
            }
          }
        }
      });
    }
  }, [isExpanded, data]);
  
  const scheduleAdd = () => {
    console.log('일정 추가 진행');
  };
  
  const toggleBookmark = async () => {
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
    }
  };
  
  const formatDescriptionWithParagraphs = (text: string) => {
    const paragraphs = text.split(/\n+/);
    return paragraphs.map((paragraph, index) => (
      <React.Fragment key={index}>
        {paragraph}
        {index < paragraphs.length - 1 && <br />}
        {index < paragraphs.length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  if (isLoading) return <DataLoading />;
  if (error) return <p>Error: {error.message}</p>;
  
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
  } = data?.data || {};
  
  return (
    <>
      <Head>
        <title>{placeName} - 여행지 상세 정보</title>
        <meta
          name="description"
          content={`${placeName}의 상세 정보를 확인하세요. ${country}, ${city}, ${district}에 위치한 이 여행지는 ${useTime ? `운영 시간: ${useTime}` : '정보 제공'}.`}
        />
        <meta name="keywords" content={`${placeName}, 여행지 정보, ${country} 여행, ${city} 명소, ${district}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <meta property="og:title" content={`${placeName} - 여행지 상세 정보`} />
        <meta property="og:description" content={`${placeName}의 상세 정보를 확인하세요. ${country}, ${city}, ${district}에 위치한 이 여행지는 ${useTime ? `운영 시간: ${useTime}` : '정보 제공'}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://triptune.netlify.app/Travel/${placeId}`} />
      </Head>
      
      <div className={styles.travelDetailContent}>
        <div className={styles.topSection}>
          <div>
            {imageList && imageList.length > 0 ? (
              <StyledSwiperContainer>
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
                      <div className={styles.sliderImageContainer}>
                        {imageLoading && <DataLoading />}
                        <Image
                          src={image.imageUrl}
                          alt={image.imageName}
                          layout='responsive'
                          width={749}
                          height={512}
                          onLoad={() => setImageLoading(false)}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <StyledSwiperButtonPrev ref={prevRef} />
                <StyledSwiperButtonNext ref={nextRef} />
              </StyledSwiperContainer>
            ) : (
              <div className={styles.noImage}>이미지가 없습니다.</div>
            )}
          </div>
          <div className={styles.rightSection}>
            <p className={styles.countryCityDistrict}>
              {country} &gt; {city} &gt; {district}
            </p>
            <div className={styles.detailplaceName}>{placeName}</div>
            <div className={styles.addressLabel}>
              <Image src={locationIcon} alt={'주소'} />
              주소 : {address}
            </div>
            {useTime && (
              <div className={styles.useTimeLabel}>
                <Image src={timeIcon} alt={'이용 시간'} />
                이용 시간 : {useTime}
              </div>
            )}
            {homepage && (
              <div className={styles.homepageLabel}>
                <Image src={homePageIcon} alt={'홈페이지'} />
                홈페이지 : <a href={homepage}>{homepage}</a>
              </div>
            )}
            {phoneNumber && (
              <div className={styles.phoneLabel}>
                <Image src={phoneIcon} alt={'문의'} />
                문의 : {phoneNumber}
              </div>
            )}
            <div className={styles.buttonContainer}>
              <button onClick={toggleBookmark} className={styles.bookmarkBtn}>
                <Image src={isBookmarked ? detailBookMark : detailBookMarkNo} alt="북마크" />
                {isBookmarked ? '북마크 해제' : '북마크'}
              </button>
              <button onClick={scheduleAdd} className={styles.chooseBtn}>
                <Image src={scheduleIcon} alt="일정 등록" /> 내 일정에 추가
              </button>
            </div>
          </div>
        </div>
        
        <h2 className={styles.detailTitle}>
          <Image src={triptuneIcon} alt="상세 설명" />
          상세 설명
        </h2>
        <div className={styles.infoSection}>
          <p
            ref={descriptionRef}
            className={styles.infoText}
            style={{
              display: isExpanded ? 'block' : '-webkit-box',
              WebkitLineClamp: isExpanded ? 'unset' : 3,
            }}
          >
            {description ? formatDescriptionWithParagraphs(description) : '설명 불러오는 중...'}
          </p>
          {showExpandButton && (
            <button onClick={handleExpandClick} className={styles.expandButton}>
              {isExpanded ? '접기 ▲' : '더 보기 ▼'}
            </button>
          )}
        </div>
        <DetailPlaceMap latitude={latitude ?? 0} longitude={longitude ?? 0} />
      </div>
    </>
  );
};

export default TravelDetail;
