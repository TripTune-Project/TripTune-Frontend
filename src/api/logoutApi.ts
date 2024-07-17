import axios from 'axios';
import Cookies from 'js-cookie';

export const logoutApi = async () => {
	const accessToken = Cookies.get('trip-tune_at');
	const userId = Cookies.get('userId');
	if (accessToken) {
		try {
			const response = await axios.patch('/api/members/logout', {
				userId: userId,
			}, {
				headers: {
					'Authorization': `Bearer ${accessToken}`
				}
			});
			
			if (response.status !== 200) {
				throw new Error('Logout failed');
			}
			
			Cookies.remove('trip-tune_at');
			Cookies.remove('trip-tune_rt');
			Cookies.remove('userId');
			window.location.href = '/';
		} catch (error) {
			throw new Error('Logout failed');
		}
	}
};
