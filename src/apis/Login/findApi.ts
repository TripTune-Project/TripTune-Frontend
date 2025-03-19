import { post } from '../api';

interface FindIdResponse {
  data: {
    userId: string;
  }
  success: boolean;
  message: string;
}

interface FindPasswordResponse {
  success: boolean;
  message: string;
}

export const requestFindId = async (email: string): Promise<FindIdResponse> => {
  const url = '/api/members/find-id';
  return await post<FindIdResponse>(url, {
    email,
  });
};

export const requestFindPassword = async (
  email: string,
  userId: string
): Promise<FindPasswordResponse> => {
  const url = '/api/emails/find-password';
  return await post<FindPasswordResponse>(url, {
    email,
    userId,
  });
};
