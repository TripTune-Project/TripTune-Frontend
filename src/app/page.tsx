'use client';

import React from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import travelImage from '../../public/assets/travel-main.png';
import favicon from '../../public/favicon.ico';
import styles from '../styles/onBoard.module.css';
import travel from '../../public/assets/images/travel.png';
import time from '../../public/assets/images/time.png';
import SwiperComponent from '../components/Common';

const Home: React.FC = () => {
	const router = useRouter();
	
	const handleLoginClick = () => {
		router.push('/Login');
	};
	
	const test_images = [
		'../../public/assets/images/picture_1.png',
		'../../public/assets/images/picture_2.png',
		'../../public/assets/images/picture_3.png'
	];
	
	return (
		<>
			<div className={styles.onboarding_top}>
				<div className={styles.onboarding_view}>
					<Image className={styles.onboarding_img} src={travelImage} alt="온보딩 이미지" layout="fill" objectFit="cover"/>
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
					<div className={styles.button_container}> {/* Additional container for buttons */}
						<div className={styles.viewBtn}>
							<Image src={time} className={styles.time} alt={"일정 만들기"}/>
							<p>일정 만들기</p>
							<button className={styles.go_link}>바로가기</button>
						</div>
						<div className={styles.viewBtn}>
							<Image src={travel} className={styles.travel} alt={"여행지 탐색"}/>
							<p>여행지 탐색</p>
							<button className={styles.go_link}>바로가기</button>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.recommended_destinations}>
				<h2 className={styles.choose_recomend}><Image src={favicon} alt={"파비콘"}/>추천 여행지</h2>
				<button className={styles.onboard_choose_btn}>전체</button>
				<button className={styles.onboard_no_choose_btn}>국내</button>
				<button className={styles.onboard_no_choose_btn}>해외</button>
				<button className={styles.onboard_choose_btn_more}>더보기</button>
				<SwiperComponent images={test_images} />
			</div>
		</>
	)
		;
};

export default Home;
