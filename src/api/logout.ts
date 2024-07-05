export const logout = async () => {
	// 로그아웃 처리 로직 (예: API 호출)
	await fetch('/api/logout', {
		method: 'POST',
		credentials: 'include',
	});
	// 로그아웃 후 페이지 이동
	window.location.href = '/login';
};
