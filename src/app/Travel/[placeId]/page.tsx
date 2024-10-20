'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import detailBookMarkNo from '../../../../public/assets/icons/ic_detail_no_bookmark.png';
import detailBookMark from '../../../../public/assets/icons/ic_detail_bookmark.png';
import scheduleIcon from '../../../../public/assets/icons/ic_schedule.png';
import triptuneIcon from '../../../../public/assets/icons/ic_triptune.png';
import locationIcon from '../../../../public/assets/icons/ic_location.png';
import timeIcon from '../../../../public/assets/icons/ic_time.png';
import homePageIcon from '../../../../public/assets/icons/ic_homepage.png';
import phoneIcon from '../../../../public/assets/icons/ic_phone.png';
import styled from 'styled-components';
import pictureImage from '../../../../public/assets/images/pictureImage.png';
import VerificationLoading from '@/components/Common/VerificationLoading';

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

// const images = [
//   {
//     src: pictureImage,
//     alt: '경복궁',
//     title: '경복궁',
//     description: '서울 종로구 경복궁',
//   },
//   {
//     src: pictureImage,
//     alt: '남산타워',
//     title: '남산타워',
//     description: '서울 용산구 남산타워',
//   },
//   {
//     src: pictureImage,
//     alt: '한라산',
//     title: '한라산',
//     description: '제주 서귀포시 한라산',
//   },
//   {
//     src: pictureImage,
//     alt: '해운대 해수욕장',
//     title: '해운대 해수욕장',
//     description: '부산 해운대구 해운대 해수욕장',
//   },
//   {
//     src: pictureImage,
//     alt: '동대문 디자인 플라자',
//     title: '동대문 디자인 플라자',
//     description: '서울 중구 동대문 디자인 플라자',
//   },
// ];

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
  
  const UseTimeUI = ({ useTime }: { useTime: string }) => {
    return (
      <div className={styles.useTimeLabel}>
        <Image className={styles.useTimeIcon} src={timeIcon} alt={'시간UI'} />
        이용시간 : {useTime}
      </div>
    );
  };
  
  const CheckInOutUI = ({
                          checkInTime,
                          checkOutTime,
                        }: {
    checkInTime: string;
    checkOutTime: string;
  }) => {
    return (
      <div className={styles.checkInOutLabel}>
        <Image
          className={styles.checkInOutIcon}
          src={timeIcon}
          alt={'시간UI'}
        />
        <div>
          {checkInTime && <div>입실시간: {checkInTime}</div>}
          {checkOutTime && <div>퇴실시간: {checkOutTime}</div>}
        </div>
      </div>
    );
  };
  
  const renderTimeContent = (
    checkInTime?: string,
    checkOutTime?: string,
    useTime?: string,
  ) => {
    if (checkInTime || checkOutTime) {
      return (
        <CheckInOutUI
          checkInTime={typeof checkInTime === 'string' ? checkInTime : ''}
          checkOutTime={typeof checkOutTime === 'string' ? checkOutTime : ''}
        />
      );
    } else if (useTime) {
      return <UseTimeUI useTime={useTime} />;
    } else {
      return null;
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
    detailAddress,
    description,
    imageList,
    latitude,
    longitude,
    phoneNumber,
    homepage,
    checkInTime,
    checkOutTime,
    useTime,
  } = data?.data || {};
  
  return (
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
                      {imageLoading && <VerificationLoading />}
                      <Image
                        src={image.imageUrl}
                        alt={image.imageName}
                        layout="responsive"
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
            주소 : {address} {detailAddress}
          </div>
          {renderTimeContent(checkInTime, checkOutTime, useTime)}
          {homepage && (
            <div className={styles.homepageLabel}>
              
              <Image src={homePageIcon} alt={'홈페이지'} />
              <span className={styles.homepageText}> 홈페이지 : {' '}</span>
              <p dangerouslySetInnerHTML={{ __html: homepage }} />
            </div>
          )}
          <div className={styles.phoneLabel}>
            
            <Image src={phoneIcon} alt={'문의 및 안내'} />
            문의 및 안내 : {phoneNumber}
          </div>
          <div className={styles.buttonContainer}>
            {isBookmarked ? (
              <button className={styles.bookmarkBtn} onClick={toggleBookmark}>
                <Image src={detailBookMark} alt={'북마크 등록'} priority />{' '}
                북마크
              </button>
            ) : (
              <button className={styles.bookmarkBtn} onClick={toggleBookmark}>
                <Image src={detailBookMarkNo} alt={'북마크 해제'} priority />{' '}
                북마크
              </button>
            )}
            <button className={styles.chooseBtn} onClick={scheduleAdd}>
              <Image src={scheduleIcon} alt={'일정등록'} priority /> 내 일정
              담기
            </button>
          </div>
        </div>
      </div>
      <h2 className={styles.detailTitle}>
        <Image src={triptuneIcon} alt={'상세설명'} priority />
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
          {description
            ? formatDescriptionWithParagraphs(description)
            : '상세 설명을 불러오는 중입니다...'}
        </p>
        {showExpandButton && (
          <button onClick={handleExpandClick} className={styles.expandButton}>
            {isExpanded ? '접기 ▲' : '내용 더 보기 ▼'}
          </button>
        )}
      </div>
      <DetailPlaceMap latitude={latitude ?? 0} longitude={longitude ?? 0} />
      {/* TODO : 추천 여행지의 슬라이더와 기본 여행지 탐색의 슬리이더는 다르다.*/}
      {/*<StyledSwiperContainer>*/}
      {/*  <Swiper*/}
      {/*    modules={[Navigation, Pagination]}*/}
      {/*    slidesPerView={4}*/}
      {/*    navigation={{*/}
      {/*      nextEl: '.swiper-button-next',*/}
      {/*      prevEl: '.swiper-button-prev',*/}
      {/*    }}*/}
      {/*    loop*/}
      {/*  >*/}
      {/*    {images.map((image, index) => (*/}
      {/*      <SwiperSlide key={index}>*/}
      {/*        <div className={styles.imgSliderContainer}>*/}
      {/*          <Image*/}
      {/*            className={styles.sliderImg}*/}
      {/*            src={image.src}*/}
      {/*            alt={image.alt}*/}
      {/*            width={400}*/}
      {/*            height={280}*/}
      {/*          />*/}
      {/*          <p className={styles.sliderTextP}>{image.title}</p>*/}
      {/*          <p className={styles.sliderTextPDetail}>*/}
      {/*            <Image*/}
      {/*              src={locationIcon}*/}
      {/*              alt={'장소'}*/}
      {/*              width={15}*/}
      {/*              height={21}*/}
      {/*            />*/}
      {/*            &nbsp;*/}
      {/*            {image.description}*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*      </SwiperSlide>*/}
      {/*    ))}*/}
      {/*    <StyledSwiperButtonPrev className='swiper-button-prev' />*/}
      {/*    <StyledSwiperButtonNext className='swiper-button-next' />*/}
      {/*  </Swiper>*/}
      {/*</StyledSwiperContainer>*/}
    </div>
  );
};

export default TravelDetail;
