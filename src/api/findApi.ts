import { post } from './api';

interface FindIdResponse {
  id: string;
}

interface FindPasswordResponse {
  success: boolean;
  message: string;
}

export const requestFindId = async (email: string): Promise<FindIdResponse> => {
  try {
    const response = await post<FindIdResponse>('/members/find-id', { email });
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '이메일이 유효하지 않습니다.'
    );
  }
};

export const requestFindPassword = async (
  email: string,
  userId: string
): Promise<FindPasswordResponse> => {
  try {
    return await post<FindPasswordResponse>('/emails/verify', {
      email,
      userId,
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '이메일이 유효하지 않습니다.'
    );
  }
};
