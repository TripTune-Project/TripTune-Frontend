'use client';

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '@/styles/Travel.module.css';
import DataLoading from '@/components/Common/DataLoading';
import SearchDetailPlaceMap from '@/components/Feature/Travel/SearchDetailPlaceMap';
import { BookMarkApi, BookMarkDeleteApi } from '@/apis/BookMark/bookMarkApi';
import styled from 'styled-components';
import MyScheduleEditModal from '@/components/Feature/Travel/MyScheduleEditModal';
import detailBookMarkNo from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_bookmarkIcon.png';
import detailBookMark from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_bookmarkIconFill.png';
import scheduleIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_scheduleIcon.png';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';
import locationIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_mapIcon.png';
import timeIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_timeIcon.png';
import homePageIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_homepageIcon.png';
import phoneIcon from '../../../../public/assets/images/여행지 탐색/상세화면/placeDetail_phoneIcon.png';
import { fetchTravelDetail } from '@/apis/Travel/travelApi';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import LoginModal from '@/components/Common/LoginModal';
import useAuth from '@/hooks/useAuth';

const StyledSwiperContainer = styled.div`
  position: relative;
  width: 749px;
  height: 512px;
`;

const StyledSwiperButtonPrev = styled.button`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  z-index: 10;
  user-select: none;
  width: 50px;
  height: 50px;
  background-image: url('/assets/images/여행지 탐색/상세화면/placeDetail_imageLeftBtn.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const StyledSwiperButtonNext = styled.button`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  z-index: 10;
  user-select: none;
  width: 50px;
  height: 50px;
  background-image: url('/assets/images/여행지 탐색/상세화면/placeDetail_imageRightBtn.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const fetchTravelDetailData = async (
  placeId: number,
  requiresAuth: boolean
) => {
  return await fetchTravelDetail(placeId, requiresAuth);
};

const TravelDetailPage = () => {
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  const params = useParams();
  const placeId = params?.placeId as string;
  const placeIdNumber = parseInt(placeId, 10);

  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 인증 상태가 확정되었는지 확인 (null이 아닌 경우)
  const isAuthStateReady = isAuthenticated !== null;
  const requiresAuth = isAuthenticated === true;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['travelDetail', placeIdNumber, requiresAuth],
    queryFn: async () => {
      const result = await fetchTravelDetailData(placeIdNumber, requiresAuth);
      if (result.success) {
        return result.data;
      } else {
        console.error(`에러 발생: ${result.message}`);
        throw new Error(result.message);
      }
    },
    enabled: isAuthStateReady, // 인증 상태가 확정된 후에만 실행
  });

  useEffect(() => {
    if (isAuthenticated !== null) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

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
            setShowExpandButton(lineCount > 3);
          }
        }
      });
    }
  }, [isExpanded, data]);

  const toggleBookmark = async (bookmarkStatus: boolean) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      if (bookmarkStatus) {
        await BookMarkDeleteApi(placeIdNumber);
      } else {
        await BookMarkApi({ placeId: placeIdNumber });
      }

      // 북마크 상태 변경 성공 시 즉시 데이터 재조회
      await refetch();
    } catch (err) {
      console.error('[토글북마크] 에러 발생 ✖', err);
      // 에러 발생 시에도 데이터 재조회하여 상태 동기화
      setTimeout(async () => {
        await refetch();
      }, 100);
    }
  };

  const handleBookmarkToggle = () => {
    toggleBookmark(data?.bookmarkStatus ?? false);
  };

  const handleScheduleAdd = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const UseTimeUI = ({ useTime }: { useTime: string }) => (
    <div className={styles.useTimeLabel}>
      <Image width={18} height={18} src={timeIcon} alt='이용 시간' />
      <p>이용시간</p>
      <>{formatDescriptionWithParagraphs(useTime, true)}</>
    </div>
  );

  const CheckInOutUI = ({
    checkInTime,
    checkOutTime,
  }: {
    checkInTime: string;
    checkOutTime: string;
  }) => (
    <div>
      <div className={styles.useTimeLabel}>
        <Image width={18} height={18} src={timeIcon} alt='입실 시간' />
        <p>입실시간</p>
        <span>{formatDescriptionWithParagraphs(checkInTime, true)}</span>
      </div>
      <div className={styles.useTimeLabel}>
        <Image width={18} height={18} src={timeIcon} alt='퇴실 시간' />
        <p>퇴실시간</p>
        <span>{formatDescriptionWithParagraphs(checkOutTime, true)}</span>
      </div>
    </div>
  );

  const renderTimeContent = (
    checkInTime?: string,
    checkOutTime?: string,
    useTime?: string
  ) => {
    if (checkInTime || checkOutTime) {
      return (
        <CheckInOutUI
          checkInTime={checkInTime ?? ''}
          checkOutTime={checkOutTime ?? ''}
        />
      );
    } else if (useTime) {
      return <UseTimeUI useTime={useTime} />;
    } else {
      return null;
    }
  };

  const formatDescriptionWithParagraphs = (text: string, applyMargin: boolean = false) => {
    const normalizedText = text.replace(/<br\s*\/?>/gi, '\n');
    const paragraphs = normalizedText.split(/\n+/);
    const hasMultipleLines = paragraphs.length > 1;

    const content = paragraphs.map((paragraph, index) => (
      <React.Fragment key={index}>
        {paragraph}
        {index < paragraphs.length - 1 && <br />}
      </React.Fragment>
    ));

    // applyMargin이 true이고 여러 줄이 있을 때만 marginLeft 적용
    if (applyMargin && hasMultipleLines) {
      return <span style={{ marginLeft: '80px' }}>{content}</span>;
    }

    return content;
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading || !data) return <DataLoading />;

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
    checkOutTime,
    checkInTime,
    bookmarkStatus,
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
      </Head>
      {showLoginModal && <LoginModal />}
      <div className={styles.travelDetailContent}>
        <div className={styles.topSection}>
          {imageList && imageList.length > 0 ? (
            <StyledSwiperContainer>
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                loop
                navigation={{
                  prevEl: prevButtonRef.current,
                  nextEl: nextButtonRef.current,
                }}
                onBeforeInit={(swiper) => {
                  if (
                    swiper.params.navigation &&
                    typeof swiper.params.navigation === 'object'
                  ) {
                    swiper.params.navigation.prevEl = prevButtonRef.current;
                    swiper.params.navigation.nextEl = nextButtonRef.current;
                  }
                }}
              >
                {imageList.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.sliderImageContainer}>
                      <Image
                        src={image.imageUrl}
                        alt={image.imageName}
                        layout='responsive'
                        width={649}
                        height={433}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <StyledSwiperButtonPrev ref={prevButtonRef} />
              <StyledSwiperButtonNext ref={nextButtonRef} />
            </StyledSwiperContainer>
          ) : (
            <div className={styles.noImage}>이미지가 없습니다.</div>
          )}
          <div className={styles.rightSection}>
            <p className={styles.countryCityDistrict}>
              {country} &gt; {city} &gt; {district}
            </p>
            <div className={styles.detailplaceName}>{placeName}</div>
            <div className={styles.scrollbar}>
              <div className={styles.addressLabel}>
                <Image width={14} height={21} src={locationIcon} alt='주소' />
                <p> 주소 </p> {address}
              </div>
              {renderTimeContent(checkInTime, checkOutTime, useTime)}
              {homepageUrl && (
                <div className={styles.homepageLabel}>
                  <Image
                    width={18}
                    height={18}
                    src={homePageIcon}
                    alt='홈페이지'
                  />
                  <p> 홈페이지 </p>
                  <a
                    href={homepageUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
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
                    alt='문의 및 안내'
                  />
                  <p> 문의 및 안내 </p> {phoneNumber}
                </div>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={handleBookmarkToggle}
                className={styles.bookmarkBtn}
                disabled={isLoading}
              >
                <Image
                  width={13}
                  height={16}
                  src={bookmarkStatus ? detailBookMark : detailBookMarkNo}
                  alt='북마크'
                />
                {bookmarkStatus ? `북마크 해제` : `북마크`}
              </button>
              <button onClick={handleScheduleAdd} className={styles.chooseBtn}>
                <Image
                  width={24}
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
        <SearchDetailPlaceMap
          latitude={latitude ?? 0}
          longitude={longitude ?? 0}
        />
      </div>
      {isLoading && <DataLoading />}
      {isModalOpen && (
        <MyScheduleEditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          placeId={placeIdNumber}
        />
      )}
    </>
  );
};

export default TravelDetailPage;
