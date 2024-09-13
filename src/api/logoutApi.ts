import axios from 'axios';
import Cookies from 'js-cookie';

export const logoutApi = async () => {
  const accessToken = Cookies.get('trip-tune_at');
  const userId = Cookies.get('userId');
  if (accessToken) {
    try {
      const response = await axios.patch(
        'http://13.209.177.247:8080/api/members/logout',
        { userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (response.status !== 200) {
        throw new Error('Logout failed');
      }
      
      Cookies.remove('trip-tune_at');
      Cookies.remove('trip-tune_rt');
      Cookies.remove('userId');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
};
