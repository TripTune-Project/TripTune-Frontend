"use client";

import React, {Suspense, useEffect, useState} from 'react';
import styles from '../../../styles/Find.module.css';
import Image from "next/image";
import favicon from "../../../../public/favicon.ico";
import { useSearchParams, useRouter } from 'next/navigation';

const FindIdComplete = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const userId = searchParams.get('userId');
	const initialTab = searchParams.get('tab');
	
	const [tab, setTab] = useState<'findId' | 'findPassword'>(initialTab as 'findId' | 'findPassword');
	
	useEffect(() => {
		setTab(initialTab as 'findId' | 'findPassword');
	}, [initialTab]);
	
	const handleTabChange = (tab: 'findId' | 'findPassword') => {
		setTab(tab);
	};
	
	const handleLinkTogoLogin = async (e: React.FormEvent) => {
		window.close();
		router.push('/Login');
	}
	
	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.FindTitle}>아이디 / 비밀번호 찾기</h1>
			<div className={styles.tabContainer}>
				<button
					className={`${styles.tabButton} ${styles.activeTab}`}
					onClick={() => handleTabChange('findId')}
				>
					아이디 찾기
				</button>
				<button
					className={`${styles.tabButton} ${tab === 'findPassword' ? styles.activeTab : ''}`}
					onClick={() =>
						router.push('/Find?tab=findPassword')}
				>
					비밀번호 찾기
				</button>
			</div>
			<p className={styles.completeText}>
				<Image src={favicon} alt={"파비콘"} width={31} height={20}/> 요청하신 아이디 찾기 결과 입니다.
			</p>
			<div className={styles.FindIdBox}>
				{userId === "undefined" || !userId ?
					<>
						<p className={styles.userIdText}>가입 정보가 존재하지 않습니다.</p>
						<p className={styles.userIdExplain}>입력된 정보를 확인해주세요.</p>
					</>
					:
					<p className={styles.userIdText}>
						아이디 : {userId}
					</p>
				}
			</div>
			<p className={styles.hint}> * SNS 아이디로 가입하신 경우 SNS 간편 로그인 기능을 이용해주세요. </p>
			<button type="submit" className={styles.submitButton} onClick={handleLinkTogoLogin}>로그인</button>
		</div>
	);
};


const WrappedFindCompletePage = () => (
	<Suspense fallback={<div>Loading...</div>}>
		<FindIdComplete/>
	</Suspense>
);

export default WrappedFindCompletePage;
