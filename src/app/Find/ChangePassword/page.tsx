"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../../../styles/Find.module.css';
import Image from "next/image";
import favicon from "../../../../public/favicon.ico";
import Loading from "../../../components/Common/Loading";
import { validatePassword } from '../../../utils/validation';

const ChangePassword = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const passwordToken = searchParams.get('passwordToken');
	const [password, setPassword] = useState('');
	const [repassword, setRepassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [isRepasswordValid, setIsRepasswordValid] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);
	
	useEffect(() => {
		if (!passwordToken) {
			console.error('No passwordToken found');
		}
	}, [passwordToken]);
	
	useEffect(() => {
		const passwordValid = validatePassword(password) === true;
		const repasswordValid = password === repassword;
		setIsPasswordValid(passwordValid);
		setIsRepasswordValid(repasswordValid);
		setIsFormValid(passwordValid && repasswordValid);
	}, [password, repassword]);
	
	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		
		if (!passwordToken) {
			alert('유효하지 않은 토큰입니다.');
			setLoading(false);
			return;
		}
		
		if (password !== repassword) {
			alert('비밀번호가 일치하지 않습니다.');
			setLoading(false);
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
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.FindTitle}>비밀번호 재설정</h1>
			<p><Image src={favicon} alt={"파비콘"} width={31} height={20}/> 새롭게 설정할 비밀번호를 입력해 주세요.</p>
			<hr className={styles.hrStyle}/>
			{loading ? (
				<Loading />
			) : (
				<>
					<p>새로운 비밀번호</p>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						placeholder={"비밀번호 (영문 대/소문자, 숫자, 특수문자 조합 8~15자리)"}
						className={styles.input}
					/>
					{!isPasswordValid && password && (
						<div className={styles.errorText}>유효한 비밀번호 형식이 아닙니다.</div>
					)}
					<p> 비밀번호 재입력 </p>
					<input
						type="password"
						id="repassword"
						value={repassword}
						onChange={(e) => setRepassword(e.target.value)}
						required
						placeholder={"비밀번호 재입력"}
						className={styles.input}
					/>
					{!isRepasswordValid && repassword && (
						<div className={styles.errorText}>비밀번호가 일치하지 않습니다.</div>
					)}
					<button
						type="submit"
						className={styles.submitButton}
						onClick={handlePasswordChange}
						disabled={!isFormValid}
					>
						비밀번호 변경
					</button>
				</>
			)}
		</div>
	);
};

const ChangePasswordPage = () => (
	<Suspense fallback={<div>Loading...</div>}>
		<ChangePassword />
	</Suspense>
);

export default ChangePasswordPage;
