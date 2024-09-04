import axios, { AxiosError } from 'axios';
import saveLocalContent from '../utils/saveLocalContent';

interface LoginData {
  userId: string;
  password: string;
}

const useLogin = () => {
  const { setEncryptedCookie } = saveLocalContent();
  
  const saveTokens = (accessToken: string, refreshToken: string, userId: string) => {
    setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
    setEncryptedCookie('trip-tune_rt', refreshToken, 7);
    setEncryptedCookie('userId', userId, 7);
  };
  
  const loginUser = async (data: LoginData) => {
    try {
      const response = await axios.post('/api/members/login', data);
      const { accessToken, refreshToken, userId } = response.data.data;
      
      saveTokens(accessToken, refreshToken, userId);
      
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || '로그인 실패'
          : '로그인 실패';
      
      throw new Error(errorMessage);
    }
  };
  
  return { loginUser };
};

export default useLogin;
