import { post } from '../api';

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  const url = '/api/members/login';
  const response = await post<{
    data: { accessToken: string; nickname: string };
  }>(url, data);

  return response;
};
