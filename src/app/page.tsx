'use client';

import React from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Pagination} from 'swiper/modules';
import styled from 'styled-components';
import travelImage from '../../public/assets/travel-main.png';
import favicon from '../../public/favicon.ico';
import styles from '../styles/onBoard.module.css';
import travel from '../../public/assets/images/travel.png';
import time from '../../public/assets/images/time.png';
import go from '../../public/assets/images/go.png';
import picture from '../../public/assets/images/picture.png';
import searchIcon from '../../public/assets/images/search-icon.png';
import place from '../../public/assets/images/place.png';

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

const Home: React.FC = () => {
	const router = useRouter();
	
	const handleScheduleClick = () => {
		router.push('/Schedule');
	};
	
	const handleTravelClick = () => {
		router.push('/Travel');
	};
	
	const handleSearch = () => {
		router.push('/Search');
	};
	
	const images = [
		{
			src: picture,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 1',
		},
		{
			src: picture,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 2',
		},
		{
			src: picture,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 3',
		},
		{
			src: picture,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 4',
		},
		{
			src: picture,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 5',
		},
	];
	
	return (
		<div className={styles.onBoard}>
			<div className={styles.onBoardingTop}>
				<div className={styles.onBoardingView}>
					<Image
						className={styles.onBoardingImg}
						src={travelImage}
						alt="온보딩 이미지"
						objectFit="cover"
					/>
					<div className={styles.onBoardingContent}>
						<div className={styles.onBoardingText}>
							<div className={styles.onBoardingExplainDiv}>
								모두의 아이디어로 완성되는 여행
							</div>
							<p className={styles.onBoardingExplainP}>
								TripTune과 함께 즐겁고 새로운 여행 계획을 세워보세요.
							</p>
						</div>
						<div className={styles.onBoardingShow}>
							<div className={styles.onBoardingSearch}>
								<select className={styles.filterSelect}>
									<option value="country">국가명</option>
									<option value="city">도시명</option>
								</select>
								<input
									type="text"
									placeholder="원하는 여행지를 검색하세요"
									className={styles.searchInput}
								/>
								<button
									className={styles.searchButton}
									onClick={handleSearch}
								>
								<Image
									src={searchIcon}
									alt="돋보기 아이콘"
									width={20}
									height={20}
									style={{marginLeft:"30px"}}
								/>
							</button>
							</div>
							<div className={styles.buttonContainer}>
								<div className={styles.viewBtn} onClick={handleScheduleClick}>
									<div className={styles.viewTitle}>일정 만들기</div>
									<br/>
									<div className={styles.iconContainer}>
										<div className={styles.goLink}>
											<Image
												src={go}
												alt="바로가기"
												width={50}
												height={50}
											/>
										</div>
										<Image
											src={time}
											className={styles.time}
											alt="일정 만들기"
											width={98}
											height={82}
										/>
									</div>
								</div>
								<div className={styles.viewBtn} onClick={handleTravelClick}>
									<div className={styles.viewTitle}>여행지 탐색</div>
									<br/>
									<div className={styles.iconContainer}>
										<div className={styles.goLink}>
											<Image
												src={go}
												alt="바로가기"
												width={50}
												height={50}
											/>
										</div>
										<Image
											src={travel}
											className={styles.travel}
											alt="여행지 탐색"
											width={98}
											height={82}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.recommendedDestinations}>
				<h2 className={styles.chooseRecomend}>
					<Image src={favicon} alt={"파비콘"} style={{marginLeft:"-15px"}}/>
					추천 여행지
				</h2>
				<button className={styles.onBoardChooseBtn}>전체</button>
				<button className={styles.onBoardNoChooseBtn}>국내</button>
				<button className={styles.onBoardNoChooseBtn}>해외</button>
				<button className={styles.onBoardChooseBtnMore}>더보기</button>
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
									<Image
										className={styles.sliderImg}
										src={image.src}
										alt={image.alt}
										width={400}
										height={280}
									/>
									<p className={styles.sliderTextP}>{image.title}</p>
									<p className={styles.sliderTextPDetail}>
										<Image
											src={place}
											alt={"place"}
											width={15}
											height={21}
										/>&nbsp;
										{image.description}
									</p>
								</div>
							</SwiperSlide>
						))}
						<StyledSwiperButtonPrev className="swiper-button-prev"/>
						<StyledSwiperButtonNext className="swiper-button-next"/>
					</Swiper>
				</StyledSwiperContainer>
			</div>
		</div>
	);
};

export default Home;
