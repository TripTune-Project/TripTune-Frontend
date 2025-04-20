import { post } from '../api';
import saveLocalContent from '@/utils/saveLocalContent';

interface LoginData {
  email: string;
  password: string;
}

const { setEncryptedCookie } = saveLocalContent();

const saveTokens = (
  accessToken: string,
  nickname: string
) => {
  setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
  setEncryptedCookie('nickname', nickname, 7);
};

export const loginUser = async (data: LoginData) => {
  const url = '/api/members/login';
  const response = await post<{
    data: { accessToken: string; nickname: string };
  }>(url, data);
  
  const { accessToken, nickname } = response.data;
  saveTokens(accessToken, nickname);
  
  return response;
};
