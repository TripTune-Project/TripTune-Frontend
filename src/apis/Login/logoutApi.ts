import { patch } from '@/apis/api';
import Cookies from 'js-cookie';
import saveLocalContent from '@/utils/saveLocalContent';

export const logoutApi = async () => {
  const { getDecryptedCookie } = saveLocalContent();
  const accessToken = getDecryptedCookie('trip-tune_at');
  const nickname = getDecryptedCookie('nickname');

  const url = '/api/members/logout';
  if (accessToken) {
    await patch(
      url,
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
    window.location.href = '/';
  }
};
