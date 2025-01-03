import { post } from './Common/api';
import Cookies from 'js-cookie';
import { handleApiError } from '@/apis/Common/errorHandler';

export const refreshApi = async (): Promise<string | null> => {
  const refreshToken = Cookies.get('trip-tune_rt');
  
  try {
    const response = await post<{ data: { accessToken: string } }>(
      '/api/members/refresh',
      { refreshToken }
    );
    const newAccessToken = response.data.accessToken;
    Cookies.set('trip-tune_at', newAccessToken);
    return newAccessToken;
  } catch (error:any) {
    console.error('리프레쉬 토큰 중 오류 발생:', error);
    throw new Error(error.message);
  }
};
