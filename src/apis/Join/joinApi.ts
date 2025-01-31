import { post } from '../api';

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

export const joinMember = async (
  data: JoinMemberData
): Promise<JoinMemberResponse> => {
  const url = '/api/members/join';
  return await post<JoinMemberResponse>(url, data);
};
