import { post } from './api';

interface JoinMemberData {
  nickname: string;
  userId: string;
  password: string;
  email: string;
}

interface JoinMemberResponse {
  success: boolean;
  message: string;
  userId: string;
}

export const joinMember = async (data: JoinMemberData): Promise<JoinMemberResponse> => {
  try {
    return await post<JoinMemberResponse>('/members/join', data);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : '회원가입에 실패했습니다. 다시 시도해주세요.'
    );
  }
};
