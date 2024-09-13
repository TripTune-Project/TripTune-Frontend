import axios, { AxiosError } from 'axios';

interface JoinMemberData {
  nickname: string;
  userId: string;
  password: string;
  email: string;
}

export const joinMember = async (data: JoinMemberData) => {
  try {
    const response = await axios.post(
      'http://13.209.177.247:8080/api/members/join',
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.');
  }
};
