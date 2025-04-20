import { post } from '../api';

interface FindPasswordResponse {
  success: boolean;
  message: string;
}

export const requestFindPassword = async (
  email: string
): Promise<FindPasswordResponse> => {
  const url = '/api/members/find-password';
  return await post<FindPasswordResponse>(url, {
    email,
  });
};
