import { patch } from '@/apis/api';
import saveLocalContent from '@/utils/saveLocalContent';
import Cookies from 'js-cookie';

export const logoutApi = async () => {
  const { getDecryptedCookie, setEncryptedCookie } = saveLocalContent();
  const accessToken = getDecryptedCookie('accessToken');
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
    
    Cookies.remove('accessToken');
    Cookies.remove('nickname');

    //TODO : 리프레시 토큰을 프론트가 지울 수 있나요?
    Cookies.remove('refreshToken');
  }
};
