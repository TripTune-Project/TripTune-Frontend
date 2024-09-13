import { post } from './api';
import saveLocalContent from '../utils/saveLocalContent';

interface LoginData {
  userId: string;
  password: string;
}

const { setEncryptedCookie } = saveLocalContent();

const saveTokens = (
  accessToken: string,
  refreshToken: string,
  userId: string
) => {
  setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
  setEncryptedCookie('trip-tune_rt', refreshToken, 7);
  setEncryptedCookie('userId', userId, 7);
};

export const loginUser = async (data: LoginData) => {
  try {
    const responseData = await post<{ data: { accessToken: string; refreshToken: string; userId: string } }>(
      '/members/login',
      data
    );
    
    const { accessToken, refreshToken, userId } = responseData.data;
    saveTokens(accessToken, refreshToken, userId);
    
    return responseData;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '로그인 실패');
  }
};
