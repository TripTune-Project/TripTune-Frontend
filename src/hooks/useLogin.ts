import { useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import useSaveLocalContent from './useSaveLocalContent';

interface LoginData {
  userId: string;
  password: string;
}

const useLogin = () => {
  const { setEncryptedCookie } = useSaveLocalContent();

  const loginUser = useCallback(
    async (data: LoginData) => {
      try {
        const response = await axios.post('/api/members/login', data);
        const { accessToken, refreshToken, userId } = response.data.data;
        
        setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
        setEncryptedCookie('trip-tune_rt', refreshToken, 7);
        setEncryptedCookie('userId', userId, 7);

        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.message || '로그인 실패');
        } else {
          throw new Error('로그인 실패');
        }
      }
    },
    [setEncryptedCookie]
  );

  return { loginUser };
};

export default useLogin;
