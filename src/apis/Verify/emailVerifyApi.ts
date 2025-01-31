import { post } from '../api';

export const requestEmailVerification = async (
  email: string
): Promise<string> => {
  const response = await post<{ message: string }>(
    '/api/emails/verify-request',
    {
      email,
    }
  );
  return response.message;
};

export const verifyEmail = async (
  email: string,
  authCode: string
): Promise<string> => {
  const response = await post<{ message: string }>('/api/emails/verify', {
    email,
    authCode,
  });
  return response.message;
};
