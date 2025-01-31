import { post } from '../api';
import saveLocalContent from '@/utils/saveLocalContent';

export const refreshApi = async (): Promise<string | null> => {
  const { setEncryptedCookie, getDecryptedCookie } = saveLocalContent();
  const refreshToken = getDecryptedCookie('trip-tune_rt');

  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다. 다시 로그인 해주세요.');
  }
  const url = '/api/members/refresh';
  const response = await post<{ data: { accessToken: string } }>(url, {
    refreshToken,
  });
  const newAccessToken = response.data.accessToken;
  setEncryptedCookie('trip-tune_at', newAccessToken, 5 / (24 * 60));
  return newAccessToken;
};
