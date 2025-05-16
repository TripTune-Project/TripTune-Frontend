import { post } from '../api';

export interface EmailApiResponse {
  message: string;
  success?: boolean;
  error?: string;
}

export const requestEmailVerification = async (
  email: string
): Promise<EmailApiResponse> => {
  try {
    return await post<EmailApiResponse>('/api/emails/verify-request', {
      email,
    });
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error(
      error.message || '이메일 인증 요청 중 오류가 발생했습니다.'
    );
  }
};

/**
 * 이메일 인증 확인 함수
 * 사용자가 입력한 인증 코드의 유효성을 검증합니다.
 *
 * @param email - 인증할 이메일 주소
 * @param authCode - 사용자가 입력한 인증 코드
 * @returns 이메일 인증 결과
 */
export const verifyEmail = async (
  email: string,
  authCode: string
): Promise<EmailApiResponse> => {
  try {
    return await post<EmailApiResponse>('/api/emails/verify', {
      email,
      authCode,
    });
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error(
      error.message || '이메일 인증 검증 중 오류가 발생했습니다.'
    );
  }
};
