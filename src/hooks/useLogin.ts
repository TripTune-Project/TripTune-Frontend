// hooks/useLogin.ts
import { useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AxiosError } from 'axios';
import useSaveLocalContent from './useSaveLocalContent';

interface LoginData {
  userId: string;
  password: string;
}

const useLogin = () => {
  const { setEncryptedCookie } = useSaveLocalContent();
  
  const loginUser = useCallback(async (data: LoginData) => {
    try {
      const response = await axiosInstance.post('/api/members/login', data);
      const { accessToken, refreshToken } = response.data.data;
      
      setEncryptedCookie('trip-tune_at', accessToken, 7);
      setEncryptedCookie('trip-tune_rt', refreshToken, 7);
      
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || '로그인 실패');
      } else {
        throw new Error('로그인 실패');
      }
    }
  }, [setEncryptedCookie]);
  
  return { loginUser };
};

export default useLogin;
