// http://localhost:3000/Find/ChangePassword?token={백엔드에게 받아야하는 토큰}

"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const ChangePassword = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get('token');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	
	useEffect(() => {
		if (!token) {
			console.error('No token found');
		}
	}, [token]);
	
	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!token) {
			alert('유효하지 않은 토큰입니다.');
			return;
		}
		
		if (newPassword !== confirmPassword) {
			alert('비밀번호가 일치하지 않습니다.');
			return;
		}
		
		try {
			const response = await fetch('/api/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, newPassword }),
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
		<div>
			<h1>비밀번호 변경</h1>
			<form onSubmit={handlePasswordChange}>
				<label htmlFor="newPassword">새 비밀번호:</label>
				<input
					type="password"
					id="newPassword"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
				/>
				<label htmlFor="confirmPassword">비밀번호 확인:</label>
				<input
					type="password"
					id="confirmPassword"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
				<button type="submit">변경</button>
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
