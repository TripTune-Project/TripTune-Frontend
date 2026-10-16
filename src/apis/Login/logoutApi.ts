import { patch } from '@/apis/api';
import saveLocalContent, { removeAuthCookies } from '@/utils/saveLocalContent';
import Cookies from 'js-cookie';

export const logoutApi = async () => {
  const { getDecryptedCookie } = saveLocalContent();
  const accessToken = Cookies.get('accessToken');
  const nickname = getDecryptedCookie('nickname');

  const url = '/api/members/logout';
  if (accessToken) {
    await patch(
      url,
      { nickname },
      {
        requiresAuth: true,
      }
    );

    removeAuthCookies();
  }
};
