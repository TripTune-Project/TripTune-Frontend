import { post } from './api';
import Cookies from 'js-cookie';
import saveLocalContent from '@/utils/saveLocalContent';
import Router from 'next/router';

export const refreshApi = async (): Promise<string> => {
  const { setEncryptedCookie } = saveLocalContent();
  const refreshToken = Cookies.get('trip-tune_rt');
  
  if (!refreshToken) throw new Error('리프레시 토큰을 사용할 수 없습니다.');
  
  try {
    const response = await post<{ data: { accessToken: string } }>('/members/refresh', {
      refreshToken,
    });
    
    const newAccessToken = response.data.accessToken;
    setEncryptedCookie('trip-tune_at', newAccessToken, 5 / (24 * 60));
    return newAccessToken;
  } catch (error) {
    console.error('액세스 토큰 갱신 에러:', error);
    
    if (
      error.response &&
      error.response.data &&
      error.response.data.errorCode === 401 &&
      error.response.data.message === "DB에 저장된 refresh token과 일치하지 않습니다. 다시 로그인해주세요."
    ) {
      await Router.push('/login');
    }
    
    throw new Error('액세스 토큰 갱신에 실패했습니다.');
  }
};
