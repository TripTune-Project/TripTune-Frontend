'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { requestFindId, requestFindPassword } from '../../api/findApi';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../../styles/Find.module.css';
import useErrorBoundary from '../../hooks/useErrorBoundary'; // 경로에 맞게 수정

const FindPage: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialTab = searchParams.get('tab') || 'findId';
	const [tab, setTab] = useState<'findId' | 'findPassword'>(initialTab as 'findId' | 'findPassword');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [message, setMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	
	useEffect(() => {
		setTab(initialTab as 'findId' | 'findPassword');
	}, [initialTab]);
	
	const handleTabChange = (tab: 'findId' | 'findPassword') => {
		setTab(tab);
		setEmail('');
		setUsername('');
		setMessage('');
		setErrorMessage('');
	};
	
	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};
	
	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};
	
	const handleFindIdSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const responseMessage = await requestFindId(email);
			setMessage(responseMessage);
			setErrorMessage('');
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage('아이디 찾기 요청에 실패했습니다. 다시 시도해주세요.');
			}
			setMessage('');
		}
	};
	
	const handleFindPasswordSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const responseMessage = await requestFindPassword(email, username);
			setMessage(responseMessage);
			setErrorMessage('');
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage('비밀번호 찾기 요청에 실패했습니다. 다시 시도해주세요.');
			}
			setMessage('');
		}
	};
	
	const { ErrorFallback } = useErrorBoundary();
	
	return (
		<div className={styles.pageContainer}>
			<ErrorFallback>
				<div className={styles.tabContainer}>
					<button
						className={`${styles.tabButton} ${tab === 'findId' ? styles.activeTab : ''}`}
						onClick={() => handleTabChange('findId')}
					>
						아이디 찾기
					</button>
					<button
						className={`${styles.tabButton} ${tab === 'findPassword' ? styles.activeTab : ''}`}
						onClick={() => handleTabChange('findPassword')}
					>
						비밀번호 찾기
					</button>
				</div>
				{tab === 'findId' && (
					<div>
						<h2>아이디 찾기</h2>
						<form onSubmit={handleFindIdSubmit}>
							<div className={styles.inputGroup}>
								<label htmlFor="email">이메일</label>
								<input
									type="email"
									id="email"
									value={email}
									onChange={handleEmailChange}
									required
									className={styles.input}
								/>
							</div>
							<button type="submit" className={styles.submitButton}>
								제출하기
							</button>
						</form>
					</div>
				)}
				{tab === 'findPassword' && (
					<div>
						<h2>비밀번호 찾기</h2>
						<form onSubmit={handleFindPasswordSubmit}>
							<div className={styles.inputGroup}>
								<label htmlFor="username">아이디</label>
								<input
									type="text"
									id="username"
									value={username}
									onChange={handleUsernameChange}
									required
									className={styles.input}
								/>
							</div>
							<div className={styles.inputGroup}>
								<label htmlFor="email">이메일</label>
								<input
									type="email"
									id="email"
									value={email}
									onChange={handleEmailChange}
									required
									className={styles.input}
								/>
							</div>
							<button type="submit" className={styles.submitButton}>
								제출하기
							</button>
						</form>
					</div>
				)}
				{message && <p className={styles.message}>{message}</p>}
				{errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
			</ErrorFallback>
		</div>
	);
};

const WrappedFindPage = () => (
	<Suspense fallback={<div>Loading...</div>}>
		<FindPage />
	</Suspense>
);

export default WrappedFindPage;
