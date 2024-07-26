'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import styled from 'styled-components';
import travelImage from '../../public/assets/travel-main.png';
import favicon from '../../public/favicon.ico';
import styles from '../styles/onBoard.module.css';
import travel from '../../public/assets/images/travel.png';
import time from '../../public/assets/images/time.png';

const StyledSwiperButtonPrev = styled.div`
    background: none;
    border: none;
    color: #000;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
    user-select: none;
    position: absolute;
    left: 10px;
    &::after {
        content: '';
        display: block;
        width: 30px;
        height: 30px;
        background-size: cover;
        background-image: url('/assets/images/left_btn.png');
    }
`;

const StyledSwiperButtonNext = styled.div`
    background: none;
    border: none;
    color: #000;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
    user-select: none;
    position: absolute;
    right: 10px;
    &::after {
        content: '';
        display: block;
        width: 30px;
        height: 30px;
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
	
	const images = [
		{
			src: travel,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 1',
		},
		{
			src: travel,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 2',
		},
		{
			src: travel,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 3',
		},
		{
			src: travel,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 4',
		},
		{
			src: travel,
			alt: '광화문',
			title: '광화문',
			description: '서울 종로구 효자로 12 국립고궁박물관 5',
		},
	];
	
	return (
		<div className={styles.onboard}>
			<div className={styles.onboarding_top}>
				<div className={styles.onboarding_view}>
					<Image className={styles.onboarding_img} src={travelImage} alt="온보딩 이미지" objectFit="cover"
					       width={"890"} height={"440"} />
					<div className={styles.onboarding_explain_div}>모두의 아이디어로 완성되는 여행</div>
					<p className={styles.onboarding_explain_p}>TripTune과 함께 즐겁고 새로운 여행 계획을 세워보세요.</p>
				</div>
				<div className={styles.onboarding_show}>
					<div className={styles.onboarding_search}>
						<select className={styles.filter_select}>
							<option value="country">국가명</option>
							<option value="city">도시명</option>
						</select>
						<input
							type="text"
							placeholder="원하는 여행지를 검색하세요"
							className={styles.search_input}
						/>
					</div>
					<div className={styles.button_container}>
						<div className={styles.viewBtn} onClick={handleScheduleClick}>
							<Image src={time} className={styles.time} alt={"일정 만들기"} />
							<p>일정 만들기</p>
							<button className={styles.go_link}>바로가기</button>
						</div>
						<div className={styles.viewBtn} onClick={handleTravelClick}>
							<Image src={travel} className={styles.travel} alt={"여행지 탐색"} />
							<p>여행지 탐색</p>
							<button className={styles.go_link}>바로가기</button>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.recommended_destinations}>
				<h2 className={styles.choose_recomend}><Image src={favicon} alt={"파비콘"} />추천 여행지</h2>
				<button className={styles.onboard_choose_btn}>전체</button>
				<button className={styles.onboard_no_choose_btn}>국내</button>
				<button className={styles.onboard_no_choose_btn}>해외</button>
				<button className={styles.onboard_choose_btn_more}>더보기</button>
				<Swiper
					modules={[Navigation, Pagination]}
					spaceBetween={30}
					slidesPerView={4}
					navigation={{
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
					}}
					loop
				>
					{images.map((image, index) => (
						<SwiperSlide key={index}>
							<div className={styles.img_slider_container}>
								<Image className={styles.slider_img} src={image.src} alt={image.alt} width={400} height={280} />
								<p className={styles.slider_text_p}>{image.title}</p>
								<p className={styles.slider_text_p_detail}>{image.description}</p>
							</div>
						</SwiperSlide>
					))}
					<StyledSwiperButtonPrev className="swiper-button-prev" />
					<StyledSwiperButtonNext className="swiper-button-next" />
				</Swiper>
			</div>
		</div>
	);
};

export default Home;
