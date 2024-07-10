"use client";

import React, { useEffect, useState } from 'react';
import { requestFindId, requestFindPassword } from '@/api/findApi';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../../styles/Find.module.css';
import { Alert, Snackbar } from '@mui/material';

const Find: React.FC = () => {
	const searchParams = useSearchParams();
	const initialTab = searchParams.get('tab') || 'findId';
	
	const [tab, setTab] = useState<'findId' | 'findPassword'>(initialTab as 'findId' | 'findPassword');
	const [email, setEmail] = useState('');
	const [userId, setUserId] = useState('');
	const [message, setMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
	
	useEffect(() => {
		setTab(initialTab as 'findId' | 'findPassword');
	}, [initialTab]);
	
	const handleTabChange = (tab: 'findId' | 'findPassword') => {
		setTab(tab);
		setEmail('');
		setUserId('');
		setMessage('');
		setErrorMessage('');
	};
	
	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};
	
	const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserId(event.target.value);
	};
	
	const handleFindIdSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const responseMessage = await requestFindId(email);
			setMessage(responseMessage);
			setErrorMessage('');
			setAlertSeverity('success');
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage('아이디 찾기 요청에 실패했습니다. 다시 시도해주세요.');
			}
			setMessage('');
			setAlertSeverity('error');
		} finally {
			setAlertOpen(true);
		}
	};
	
	const handleFindPasswordSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const responseMessage = await requestFindPassword(email, userId);
			setMessage(responseMessage);
			setErrorMessage('');
			setAlertSeverity('success');
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage('비밀번호 찾기 요청에 실패했습니다. 다시 시도해주세요.');
			}
			setMessage('');
			setAlertSeverity('error');
		} finally {
			setAlertOpen(true);
		}
	};
	
	const handleAlertClose = () => {
		setAlertOpen(false);
	};
	
	return (
		<div className={styles.pageContainer}>
			<div className="p-4">
				<div>
					<div className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
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
					<div>
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
										<label htmlFor="userId">아이디</label>
										<input
											type="text"
											id="userId"
											value={userId}
											onChange={handleUserIdChange}
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
						<Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
							<Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
								{alertSeverity === 'success' ? message : errorMessage}
							</Alert>
						</Snackbar>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Find;
