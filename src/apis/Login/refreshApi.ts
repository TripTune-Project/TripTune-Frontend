import { post } from '../Common/api';
import Cookies from 'js-cookie';
import saveLocalContent from '@/utils/saveLocalContent';

export const refreshApi = async (): Promise<string | null> => {
  const refreshToken = Cookies.get('trip-tune_rt');
  const { setEncryptedCookie } = saveLocalContent();
  
  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다. 다시 로그인 해주세요.');
  }
  
  try {
    const response = await post<{ data: { accessToken: string } }>(
      '/api/members/refresh',
      { refreshToken }
    );
    const newAccessToken = response.data.accessToken;
    setEncryptedCookie('trip-tune_at', newAccessToken, 5 / (24 * 60));
    return newAccessToken;
  } catch (error: any) {
    console.error('리프레시 토큰 중 오류 발생:', error);
    throw new Error(error.message || '리프레시 중 알 수 없는 오류 발생');
  }
};
