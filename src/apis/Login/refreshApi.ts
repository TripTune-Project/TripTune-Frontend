import { post } from '../api';
import saveLocalContent from '@/utils/saveLocalContent';

export const refreshApi = async (): Promise<string> => {
  const response = await post<{ data: { accessToken: string } }>(
    '/api/members/refresh',
    {},
    { requiresAuth: false }
  );
  
  const newAccessToken = response.data.accessToken;
  const { setEncryptedCookie } = saveLocalContent();
  setEncryptedCookie('trip-tune_at', newAccessToken, 5 / (24 * 60));
  return newAccessToken;
};
