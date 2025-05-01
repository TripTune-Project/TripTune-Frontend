'use client';

import React, { useRef, useState, useEffect } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoginModal from '@/components/Common/LoginModal';
import saveLocalContent from '@/utils/saveLocalContent';
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
  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['travelDetail', placeIdNumber],
    queryFn: async () => {
      const { getDecryptedCookie } = saveLocalContent();
      const accessToken = getDecryptedCookie('accessToken');
      const requiresAuth = !!accessToken;
      const result = await fetchTravelDetailData(placeIdNumber, requiresAuth);
      if (result.success) {
        return result.data;
      } else {
        console.error(`에러 발생: ${result.message}`);
        throw new Error(result.message);
      }
    },
  });

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

  const toggleBookmarkMutation = useMutation({
    mutationFn: async (bookmarkStatus: boolean) => {
      if (!isAuthenticated) {
        setShowLoginModal(true);
        return;
      }
      return bookmarkStatus
        ? await BookMarkDeleteApi({ placeId: placeIdNumber })
        : await BookMarkApi({ placeId: placeIdNumber });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['travelDetail', placeIdNumber],
      });
    },
    onError: (error) => {
      console.error('북마크 변경 오류:', error);
    },
  });

  const handleBookmarkToggle = () => {
    toggleBookmarkMutation.mutate(data?.bookmarkStatus ?? false);
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
      <p>이용시간</p> {useTime}
    </div>
  );

  const CheckInOutUI = ({
    checkInTime,
    checkOutTime,
  }: {
    checkInTime: string;
    checkOutTime: string;
  }) => (
    <div className={styles.useTimeLabel}>
      <Image width={18} height={18} src={timeIcon} alt='입/퇴실 시간' />
      <p>입실시간</p> {checkInTime}
      <p>퇴실시간</p> {checkOutTime}
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
                        width={643}
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
                  alt='문의 및 안내'
                />
                <p> 문의 및 안내 </p> {phoneNumber}
              </div>
            )}
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
