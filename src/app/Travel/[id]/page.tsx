// 백엔드 적용 api 전 코드
"use client";

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styled from 'styled-components';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styles from '../../../styles/Travel.module.css';
import favicon from '../../../../public/favicon.ico';
import place from '../../../../public/assets/images/place.png';
import picture from '../../../../public/assets/images/picture.png';

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
        background-image: url('/assets/images/left_btn.png');
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
        background-image: url('/assets/images/right_btn.png');
    }
`;

const TravelDetail = ({ travelData }) => {
  const images = [
    { src: picture, alt: '경복궁', title: '경복궁', description: '서울 종로구 경복궁' },
    { src: picture, alt: '남산타워', title: '남산타워', description: '서울 용산구 남산타워' },
    { src: picture, alt: '한라산', title: '한라산', description: '제주 서귀포시 한라산' },
    { src: picture, alt: '해운대 해수욕장', title: '해운대 해수욕장', description: '부산 해운대구 해운대 해수욕장' },
    { src: picture, alt: '동대문 디자인 플라자', title: '동대문 디자인 플라자', description: '서울 중구 동대문 디자인 플라자' },
  ];
  
  return (
    <div className={styles.travelDetailContent}>
      <Head>
        <title>{`여행지 상세보기 | ${travelData.placeName}`}</title>
        <meta name="description"
              content={`Explore detailed information about ${travelData.placeName} located in ${travelData.city}, ${travelData.country}.`} />
        <meta name="keywords" content={`여행지, ${travelData.city}, ${travelData.placeName}, 추천 여행지, 여행 정보`} />
        <meta property="og:title" content={`여행지 상세보기 | ${travelData.placeName}`} />
        <meta property="og:description"
              content={`Explore detailed information about ${travelData.placeName} located in ${travelData.city}, ${travelData.country}.`} />
        <meta property="og:image" content={"/assets/Logo.png"} />
        <meta property="og:url" content={`https://triptune.com/travel/${travelData.placeId}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.chooseRecomend}>여행지 탐색 : 상세보기</h1>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <StyledSwiperContainer>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              loop
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image src={image.src} alt={image.alt} width={400} height={280} className={styles.detailSliderImg} />
                </SwiperSlide>
              ))}
              <StyledSwiperButtonPrev className="swiper-button-prev" />
              <StyledSwiperButtonNext className="swiper-button-next" />
            </Swiper>
          </StyledSwiperContainer>
        </div>
        <div className={styles.rightSection}>
          <p className={styles.country}>country : {travelData.country}</p>
          <p className={styles.city}>city : {travelData.city}</p>
          <p className={styles.district}>district : {travelData.district}</p>
          <p className={styles.placeName}>placeName: {travelData.placeName}</p>
          <p className={styles.address}>
            address: {travelData.address} {travelData.detailAddress}
          </p>
          <p className={styles.description}>
            description: {travelData.description}
          </p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.backBtn}>뒤로 가기</button>
        <button className={styles.ChooseBtn}>내 일정 담기</button>
        <button className={styles.bookmarkBtn}>북마크</button>
      </div>
      <div className={styles.recommendedDestinations}>
        <h2 className={styles.chooseRecomend}>
          <Image src={favicon} alt={'파비콘'} style={{ marginLeft: '-15px' }} priority />
          여행지 탐색 : 추천 여행지
        </h2>
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
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className={styles.imgSliderContainer}>
                  <Image src={image.src} alt={image.alt} width={400} height={280} className={styles.sliderImg} />
                  <p className={styles.sliderTextP}>{image.title}</p>
                  <p className={styles.sliderTextPDetail}>
                    <Image src={place} alt={'place'} width={15} height={21} />
                    &nbsp;{image.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
            <StyledSwiperButtonPrev className="swiper-button-prev" />
            <StyledSwiperButtonNext className="swiper-button-next" />
          </Swiper>
        </StyledSwiperContainer>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  
  const res = await fetch(`https://api.triptune.com/travel/${id}`);
  const travelData = await res.json();
  
  return {
    props: {
      travelData,
    },
  };
}

export default TravelDetail;


// 백엔드 적용 api 코드
//
// "use client";
//
// import React, { useEffect, useState } from 'react';
// import Head from 'next/head';
// import Image from 'next/image';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import styled from 'styled-components';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Navigation, Pagination } from 'swiper/modules';
// import styles from '../../../styles/Travel.module.css';
// import favicon from '../../../../public/favicon.ico';
// import placeIcon from '../../../../public/assets/images/place.png';
// import { fetchTravelDetail } from '@/api/travelApi';
// import { useRouter } from 'next/navigation';
// import { TravelPlaceDetail, TravelDetailSuccessResponse, TravelApiErrorResponse } from '@/types/travelType';
//
// const StyledSwiperContainer = styled.div`
//   overflow: hidden;
//   position: relative;
//   width: 100%;
//   max-width: 1850px;
//   margin: 0 auto;
// `;
//
// const StyledSwiperButtonPrev = styled.div`
//   position: absolute;
//   top: 50%;
//   width: 60px;
//   height: 60px;
//   left: 10px;
//   transform: translateY(-50%);
//   background: none;
//   border: none;
//   cursor: pointer;
//   z-index: 10;
//   user-select: none;
//
//   &::after {
//     content: '';
//     display: block;
//     width: 60px;
//     height: 60px;
//     background-size: cover;
//     background-image: url('/assets/images/left_btn.png');
//   }
// `;
//
// const StyledSwiperButtonNext = styled.div`
//   position: absolute;
//   top: 50%;
//   width: 60px;
//   height: 60px;
//   right: 10px;
//   transform: translateY(-50%);
//   background: none;
//   border: none;
//   cursor: pointer;
//   z-index: 10;
//   user-select: none;
//
//   &::after {
//     content: '';
//     display: block;
//     width: 60px;
//     height: 60px;
//     background-size: cover;
//     background-image: url('/assets/images/right_btn.png');
//   }
// `;
//
// const TravelDetail = ({ placeId }: { placeId: number }) => {
//   const [placeDetail, setPlaceDetail] = useState<TravelPlaceDetail | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const router = useRouter();
//
//   useEffect(() => {
//     const fetchDetail = async () => {
//       try {
//         const response: TravelDetailSuccessResponse | TravelApiErrorResponse = await fetchTravelDetail(placeId);
//
//         if (response.success && response.data) {
//           setPlaceDetail(response.data);
//         } else {
//           setErrorMessage(response.message || '데이터를 불러오는 중 오류가 발생했습니다.');
//         }
//       } catch (error) {
//         setErrorMessage('네트워크 에러가 발생했습니다. 다시 시도해주세요.');
//         console.error('Error fetching travel detail:', error);
//       }
//     };
//
//     fetchDetail();
//   }, [placeId]);
//
//   if (!placeDetail) {
//     return <div>로딩 중...</div>;
//   }
//
//   return (
//     <div className={styles.travelDetailContent}>
//       <Head>
//         <title>{placeDetail.placeName} 상세보기 | 여행지 탐색</title>
//         <meta name="description"
//               content={`Explore detailed information about ${placeDetail.placeName} located in ${placeDetail.city}, ${placeDetail.country}.`} />
//         <meta name="keywords"
//               content={`여행지, 상세보기, ${placeDetail.placeName}, ${placeDetail.city}, ${placeDetail.country}, 관광`} />
//         <meta property="og:title" content={`${placeDetail.placeName} 상세보기 | 여행지 탐색`} />
//         <meta property="og:description"
//               content={`Explore detailed information about ${placeDetail.placeName} located in ${placeDetail.city}, ${placeDetail.country}.`} />
//         <meta property="og:image" content="/assets/Logo.png" />
//         <meta property="og:url" content={`https://triptune.com/travel/${placeDetail.placeId}`} />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <h1 className={styles.chooseRecomend}>여행지 탐색 : 상세보기</h1>
//       <div className={styles.topSection}>
//         <div className={styles.leftSection}>
//           <StyledSwiperContainer>
//             {placeDetail.imageList.length > 0 ? (
//               <Swiper
//                 modules={[Navigation, Pagination]}
//                 slidesPerView={1}
//                 navigation={{
//                   nextEl: '.swiper-button-next',
//                   prevEl: '.swiper-button-prev',
//                 }}
//                 loop
//               >
//                 {placeDetail.imageList.map((image, index) => (
//                   <SwiperSlide key={index}>
//                     <Image src={image.imageUrl} alt={image.imageName} width={400} height={280} className={styles.detailSliderImg} />
//                   </SwiperSlide>
//                 ))}
//                 <StyledSwiperButtonPrev className="swiper-button-prev" />
//                 <StyledSwiperButtonNext className="swiper-button-next" />
//               </Swiper>
//             ) : (
//               <p>이미지가 없습니다.</p>
//             )}
//           </StyledSwiperContainer>
//         </div>
//         <div className={styles.rightSection}>
//           <p className={styles.country}>country : {placeDetail.country}</p>
//           <p className={styles.city}>city : {placeDetail.city}</p>
//           <p className={styles.district}>district : {placeDetail.district}</p>
//           <p className={styles.placeName}>placeName: {placeDetail.placeName}</p>
//           <p className={styles.address}>
//             address: {placeDetail.address} {placeDetail.detailAddress}
//           </p>
//           <p className={styles.description}>
//             description: {placeDetail.description}
//           </p>
//         </div>
//       </div>
//       <div className={styles.buttonContainer}>
//         <button className={styles.backBtn} onClick={() => router.back()}>뒤로 가기</button>
//         <button className={styles.ChooseBtn}>내 일정 담기</button>
//         <button className={styles.bookmarkBtn}>북마크</button>
//       </div>
//       {placeDetail.recommandedTravelList && placeDetail.recommandedTravelList.length > 0 ? (
//         <div className={styles.recommendedDestinations}>
//           <h2 className={styles.chooseRecomend}>
//             <Image src={favicon} alt={'파비콘'} style={{ marginLeft: '-15px' }} priority />
//             여행지 탐색 : 추천 여행지
//           </h2>
//           <StyledSwiperContainer>
//             <Swiper
//               modules={[Navigation, Pagination]}
//               slidesPerView={4}
//               navigation={{
//                 nextEl: '.swiper-button-next',
//                 prevEl: '.swiper-button-prev',
//               }}
//               loop
//             >
//               {placeDetail.recommandedTravelList.map((rec, index) => (
//                 <SwiperSlide key={index}>
//                   <div className={styles.imgSliderContainer}>
//                     <Image src={rec.ThumbnailUrl} alt={rec.placeName} width={400} height={280} className={styles.sliderImg} />
//                     <p className={styles.sliderTextP}>{rec.placeName}</p>
//                     <p className={styles.sliderTextPDetail}>
//                       <Image src={placeIcon} alt={'place'} width={15} height={21} />
//                       &nbsp;{rec.country} / {rec.city} / {rec.district}
//                     </p>
//                   </div>
//                 </SwiperSlide>
//               ))}
//               <StyledSwiperButtonPrev className="swiper-button-prev" />
//               <StyledSwiperButtonNext className="swiper-button-next" />
//             </Swiper>
//           </StyledSwiperContainer>
//         </div>
//       ) : (
//         <p className={styles.noRecommendations}>추천 여행지가 없습니다.</p>
//       )}
//       {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
//     </div>
//   );
// };
//
// export default TravelDetail;
