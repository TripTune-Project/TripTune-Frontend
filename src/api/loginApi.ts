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
  nickname:string
) => {
  setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
  setEncryptedCookie('trip-tune_rt', refreshToken, 7);
  setEncryptedCookie('nickname', nickname, 7);
};

export const loginUser = async (data: LoginData) => {
  try {
    const responseData = await post<{
      data: { accessToken: string; refreshToken: string; nickname: string };
    }>('/members/login', data);
    
    const { accessToken, refreshToken, nickname } = responseData.data;
    saveTokens(accessToken, refreshToken, nickname);
    
    return responseData;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '로그인 실패');
  }
};
