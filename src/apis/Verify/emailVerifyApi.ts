import { post } from '../Common/api';

export const requestEmailVerification = async (
  email: string
): Promise<string> => {
  try {
    const response = await post<{ message: string }>('/api/emails/verify-request', {
      email,
    });
    return response.message;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '인증 코드 요청에 실패했습니다.'
    );
  }
};

export const verifyEmail = async (
  email: string,
  authCode: string
): Promise<string> => {
  try {
    const response = await post<{ message: string }>('/api/emails/verify', {
      email,
      authCode,
    });
    return response.message;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '인증 코드 유효성 검사 실패'
    );
  }
};
