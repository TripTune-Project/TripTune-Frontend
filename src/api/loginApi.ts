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
  nickName:string
) => {
  setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
  setEncryptedCookie('trip-tune_rt', refreshToken, 7);
  setEncryptedCookie('nickName', nickName, 7);
};

export const loginUser = async (data: LoginData) => {
  try {
    const responseData = await post<{
      data: { accessToken: string; refreshToken: string; nickName: string };
    }>('/members/login', data);
    
    const { accessToken, refreshToken, nickName } = responseData.data;
    saveTokens(accessToken, refreshToken, nickName);
    
    return responseData;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '로그인 실패');
  }
};
