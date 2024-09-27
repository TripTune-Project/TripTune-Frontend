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
import ScheduleModal from '@/components/Schedule/ScheduleModal';
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

// TODO : SWIPER 이미지 여러개 뜨는 이슈
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
    width: 50px;
    height: 50px;
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
    width: 50px;
    height: 50px;
    background-image: url('/assets/images/detailRightBtnImage.png');
  }
`;

const TravelDetail = () => {
  const { placeId } = useParams();
  const placeIdNumber = parseInt(placeId as string, 10);
  const { data, isLoading, error } = useTravelDetail(placeIdNumber);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showExpandButton, setShowExpandButton] = useState(false);

  const nextRef = useRef(null);
  const prevRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        setIsBookmarked(false);
      } catch (error) {
        console.error('북마크 상태 확인 중 오류 발생:', error);
      }
    };

    fetchBookmarkStatus();
  }, [placeIdNumber]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSchedule = () => {
    closeModal();
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

  // TODO : CSS 모듈 추가 해야함 UseTimeUI CheckInOutUI
  const UseTimeUI = ({ useTime }: { useTime: string }) => {
    return (
      useTime ?? (
        <div>
          <Image src={timeIcon} alt={'시간UI'} /> 이용시간: {useTime}
        </div>
      )
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
      <div>
        <Image src={timeIcon} alt={'시간UI'} />
        {checkInTime ?? <div>입실시간: {checkInTime}</div>}
        {checkOutTime ?? <div>퇴실시간: {checkOutTime}</div>}
      </div>
    );
  };

  const renderTimeContent = (
    checkInTime: string,
    checkOutTime: string,
    useTime: string
  ) => {
    if (checkInTime || checkOutTime) {
      return (
        <CheckInOutUI checkInTime={checkInTime} checkOutTime={checkOutTime} />
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
    setTimeout(() => {
      if (descriptionRef.current) {
        const style = getComputedStyle(descriptionRef.current);
        const lineHeight = parseFloat(style.lineHeight) || 20;
        // TODO : 여기서 부터 진행 , 이건 빌드 이슈
        const scrollHeight = descriptionRef.current.scrollHeight;

        if (!isNaN(lineHeight)) {
          const lineCount = scrollHeight / lineHeight;

          if (lineCount > 3) {
            setShowExpandButton(true);
          } else {
            setShowExpandButton(false);
          }
        }
      }
    }, 0);
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
                      {imageLoading && <div>로딩 중...</div>}
                      <Image
                        src={image.imageUrl}
                        alt={image.imageName}
                        width={749}
                        height={512}
                        style={{ objectFit: 'cover' }}
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
            &nbsp;
            <Image src={locationIcon} alt={'주소'} />
            &nbsp; 주소 : {address} {detailAddress}
          </div>
          {renderTimeContent(checkInTime, checkOutTime, useTime)}
          {homepage && (
            <div className={styles.homepageLabel}>
              &nbsp;
              <Image src={homePageIcon} alt={'홈페이지'} />
              &nbsp; 홈페이지 :{' '}
              <p dangerouslySetInnerHTML={{ __html: homepage }} />
            </div>
          )}
          <div className={styles.phoneLabel}>
            &nbsp;
            <Image src={phoneIcon} alt={'문의 및 안내'} />
            &nbsp;문의 및 안내 : {phoneNumber}
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
            <button className={styles.chooseBtn} onClick={openModal}>
              <Image src={scheduleIcon} alt={'일정등록'} priority /> 내 일정
              담기
            </button>
          </div>
          <ScheduleModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleSchedule}
          />
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
    </div>
  );
};

export default TravelDetail;
