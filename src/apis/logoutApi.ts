import { patch } from './api';
import Cookies from 'js-cookie';

export const logoutApi = async (): Promise<void> => {
  const accessToken = Cookies.get('trip-tune_at');
  const nickname = Cookies.get('nickname');

  if (accessToken) {
    try {
      await patch(
        '/api/members/logout',
        { nickname },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Cookies.remove('trip-tune_at');
      Cookies.remove('trip-tune_rt');
      Cookies.remove('nickname');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
};
