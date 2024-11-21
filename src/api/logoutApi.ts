import { patch } from './api';
import Cookies from 'js-cookie';

export const logoutApi = async (): Promise<void> => {
  const accessToken = Cookies.get('trip-tune_at');
  const nickName = Cookies.get('nickName');

  if (accessToken) {
    try {
      await patch(
        '/members/logout',
        { nickName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Cookies.remove('trip-tune_at');
      Cookies.remove('trip-tune_rt');
      Cookies.remove('nickName');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
};
