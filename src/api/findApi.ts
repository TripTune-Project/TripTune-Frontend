import { post } from './api';

export const requestFindId = async (email: string): Promise<any> => {
  try {
    const data = await post('/members/find-id', { email });
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '이메일이 유효하지 않습니다.'
    );
  }
};

export const requestFindPassword = async (
  email: string,
  userId: string
): Promise<any> => {
  try {
    const data = await post('/members/find-password', { email, userId });
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '이메일이 유효하지 않습니다.'
    );
  }
};
