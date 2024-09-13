import axios, { AxiosError } from 'axios';

export const requestFindId = async (email: string) => {
  try {
    const response = await axios.post(
      'http://13.209.177.247:8080/api/members/find-id',
      { email }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('이메일이 유효하지 않습니다.');
  }
};

export const requestFindPassword = async (email: string, userId: string) => {
  try {
    const response = await axios.post('http://13.209.177.247:8080/api/members/find-password', {
      email,
      userId,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('이메일이 유효하지 않습니다.');
  }
};
