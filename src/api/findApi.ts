import axiosInstance from './axiosInstance';
import { AxiosError } from 'axios';

export const requestFindId = async (email: string) => {
  try {
    const response = await axiosInstance.post('/find-id', { email });
    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('아이디 찾기 요청에 실패했습니다.');
  }
};

export const requestFindPassword = async (email: string, username: string) => {
  try {
    const response = await axiosInstance.post('/find-password', { email, username });
    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('비밀번호 찾기 요청에 실패했습니다.');
  }
};
