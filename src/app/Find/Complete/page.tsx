"use client";

import React, {useEffect, useState} from 'react';
import styles from '../../../styles/Find.module.css';
import Image from "next/image";
import favicon from "../../../../public/favicon.ico";
import { useSearchParams, useRouter } from 'next/navigation';

const FindIdComplete = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const userId = searchParams.get('userId');
	const initialTab = searchParams.get('tab');
	
	const [tab, setTab] = useState<'findId'>(initialTab as 'findId');

	
	useEffect(() => {
		setTab(initialTab as 'findId');
	}, [initialTab]);
	
	const handleTabChange = (tab: 'findId') => {
		setTab(tab);
	};
	
	const handleLinkTogoLogin = async (e: React.FormEvent) => {
		router.push('/Login');
	}
	
	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.FindTitle}>아이디 / 비밀번호 찾기</h1>
			<div className={styles.tabContainer}>
				<button
					className={`${styles.tabButton} ${tab === 'findId' ? styles.activeTab : ''}`}
					onClick={() => handleTabChange('findId')}
				>
					아이디 찾기
				</button>
				<button
					className={`${styles.tabButton} ${tab === 'findPassword' ? styles.activeTab : ''}`}
					onClick={() =>
						router.push('/Find?tab=password')}
				>
					비밀번호 찾기
				</button>
			</div>
			<p><Image src={favicon} alt={"파비콘"} width={31} height={20}/> 요청하신 아이디 찾기 결과 입니다.</p>
			<div className={styles.FindIdBox}>
				아이디 : {userId}
			</div>
			<p> * SNS 아이디로 가입하신 경우 SNS 간편 로그인 기능을 이용해주세요. </p>
			<button type="submit" className={styles.submitButton} onClick={handleLinkTogoLogin}>로그인</button>
		</div>
	);
};

export default FindIdComplete;
