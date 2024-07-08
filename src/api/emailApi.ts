import axios, { AxiosError } from 'axios';

export const requestEmailVerification = async (email: string) => {
  try {
    const response = await axios.post('/api/emails/verify-request', { email });
    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('인증 코드 요청에 실패했습니다.');
  }
};

export const verifyEmail = async (email: string, authCode: string) => {
  try {
    const response = await axios.post('/api/emails/verify', { email, authCode });
    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('인증 코드 유효성 검사 실패');
  }
};
