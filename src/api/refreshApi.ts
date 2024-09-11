import axios from 'axios';
import Cookies from 'js-cookie';
import saveLocalContent from '@/utils/saveLocalContent';

export const refreshApi = async (): Promise<string> => {
  const { setEncryptedCookie } = saveLocalContent();
  const refreshToken = Cookies.get('trip-tune_rt');
  if (!refreshToken) throw new Error('Refresh token not available');
  
  try {
    const response = await axios.post('/api/members/refresh', { refreshToken });
    const newAccessToken = response.data.accessToken;
    setEncryptedCookie('trip-tune_at', newAccessToken, 5 / (24 * 60));
    return newAccessToken;
  } catch (error) {
    console.error('액세스 토큰 갱신 에러:', error);
    throw error;
  }
};
