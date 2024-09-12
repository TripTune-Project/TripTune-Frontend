import { post } from './api';
import Cookies from 'js-cookie';
import saveLocalContent from '@/utils/saveLocalContent';

export const refreshApi = async (): Promise<string> => {
  const { setEncryptedCookie } = saveLocalContent();
  const refreshToken = Cookies.get('trip-tune_rt');

  if (!refreshToken) throw new Error('리프레시 토큰을 사용할 수 없습니다.');

  try {
    const data = await post<{ accessToken: string }>('/api/members/refresh', {
      refreshToken,
    });
    const newAccessToken = data.accessToken;
    setEncryptedCookie('trip-tune_at', newAccessToken, 5 / (24 * 60));
    return newAccessToken;
  } catch (error) {
    console.error('액세스 토큰 갱신 에러:', error);
    throw new Error('액세스 토큰 갱신에 실패했습니다.');
  }
};
