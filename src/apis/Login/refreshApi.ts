import { post } from '../api';
import saveLocalContent from '@/utils/saveLocalContent';
import Cookies from 'js-cookie';

export const refreshApi = async (): Promise<{
  accessToken: string;
}> => {
  try {
    const response = await post<{
      data: {
        accessToken: string;
        nickname: string;
      };
    }>(
      '/api/members/refresh',
      {
        refreshToken: Cookies.get('refreshToken'),
      },
      {
        credentials: 'include',
        requiresAuth: true,
      }
    );

    const { accessToken } = response.data;
    // const { accessToken, nickname } = response.data;

    const { setEncryptedCookie } = saveLocalContent();
    setEncryptedCookie('accessToken', accessToken);
    // setEncryptedCookie('nickname', nickname);

    // return { accessToken, nickname };
    return { accessToken };
  } catch (error: unknown) {
    console.error('리프레시 중 오류 발생:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('리프레시 중 알 수 없는 오류 발생');
  }
};
