import { patch } from '@/apis/api';
import saveLocalContent from '@/utils/saveLocalContent';

export const logoutApi = async () => {
  const { getDecryptedCookie, setEncryptedCookie } = saveLocalContent();
  const accessToken = getDecryptedCookie('trip-tune_at');
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

    // 쿠키 만료 시간을 과거로 설정하여 삭제
    setEncryptedCookie('trip-tune_at', '', -1);
    setEncryptedCookie('refreshToken', '', -1);
    setEncryptedCookie('nickname', '', -1);
  }
};
