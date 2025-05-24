import { post } from '../api';

interface JoinMemberData {
  nickname: string;
  password: string;
  email: string;
}

interface JoinMemberResponse {
  success: boolean;
  message: string;
  data?: {
    nickname: string;
  };
}

export const joinMember = async (
  data: JoinMemberData
): Promise<JoinMemberResponse> => {
  try {
    const url = '/api/members/join';
    const response = await post<JoinMemberResponse>(url, data);
    
    // 성공 시 사용자 닉네임 데이터 추가
    if (response.success && !response.data) {
      return {
        ...response,
        data: { nickname: data.nickname }
      };
    }
    
    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '회원가입 처리 중 오류가 발생했습니다.'
    };
  }
};
