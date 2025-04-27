import { post } from '../api';
import saveLocalContent from '@/utils/saveLocalContent';

export const refreshApi = async (): Promise<{ accessToken: string; nickname: string }> => {
  const { getDecryptedCookie } = saveLocalContent();
  const refreshToken = getDecryptedCookie('trip-tune_rt');
  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다.');
  }
  try {
    const response = await post<{
      data: {
        accessToken: string;
        nickname: string;
      };
    }>(
      '/api/members/refresh',
      {},
      {
        credentials: 'include',
        requiresAuth: false,
      }
    );

    const { accessToken, nickname } = response.data;

    const { setEncryptedCookie } = saveLocalContent();
    setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
    setEncryptedCookie('nickname', nickname, 7);

    return { accessToken, nickname };
  } catch (error: unknown) {
    console.error('리프레시 중 오류 발생:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('리프레시 중 알 수 없는 오류 발생');
  }
};
