import Cookies from 'js-cookie';

export const logout = async () => {
	const accessToken = Cookies.get('trip-tune_at');
	if (accessToken) {
		await fetch('/api/members/logout', {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});
		Cookies.remove('trip-tune_at');
		Cookies.remove('trip-tune_rt');
		window.location.href = '/';
	}
};
