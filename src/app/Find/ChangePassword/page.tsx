"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../../../styles/ChangePasswordPage.module.css';

const ChangePassword = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const passwordToken = searchParams.get('passwordToken');
	const [password, setpassword] = useState('');
	const [repassword, setrepassword] = useState('');
	
	useEffect(() => {
		if (!passwordToken) {
			console.error('No passwordToken found');
		}
	}, [passwordToken]);
	
	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!passwordToken) {
			alert('유효하지 않은 토큰입니다.');
			return;
		}
		
		if (password !== repassword) {
			alert('비밀번호가 일치하지 않습니다.');
			return;
		}
		
		try {
			const response = await fetch('/api/members/change-password', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ passwordToken, password, repassword }),
			});
			
			const data = await response.json();
			
			if (data.success) {
				alert('비밀번호가 성공적으로 변경되었습니다.');
				router.push('/Login');
			} else {
				alert('비밀번호 변경에 실패했습니다.');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('비밀번호 변경에 실패했습니다.');
		}
	};
	
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>비밀번호 변경</h1>
			<form onSubmit={handlePasswordChange} className={styles.form}>
				<label htmlFor="password" className={styles.label}>새 비밀번호:</label>
				<input
					type="password"
					id="password"
					value={password}
					onChange={(e) => setpassword(e.target.value)}
					required
					className={styles.input}
				/>
				<label htmlFor="repassword" className={styles.label}>비밀번호 확인:</label>
				<input
					type="password"
					id="repassword"
					value={repassword}
					onChange={(e) => setrepassword(e.target.value)}
					required
					className={styles.input}
				/>
				<button type="submit" className={styles.button}>변경</button>
			</form>
		</div>
	);
};

const ChangePasswordPage = () => (
	<Suspense fallback={<div>Loading...</div>}>
		<ChangePassword />
	</Suspense>
);

export default ChangePasswordPage;
