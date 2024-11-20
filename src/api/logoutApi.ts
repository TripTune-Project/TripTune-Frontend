import { patch } from './api';
import Cookies from 'js-cookie';

export const logoutApi = async (): Promise<void> => {
  const accessToken = Cookies.get('trip-tune_at');
  const userId = Cookies.get('userId');

  if (accessToken) {
    try {
      await patch(
        '/members/logout',
        { userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Cookies.remove('trip-tune_at');
      Cookies.remove('trip-tune_rt');
      Cookies.remove('userId');
      // Cookies.remove('nickName');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
};
