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
      const errorMessage = error.response.message || '이메일 인증 요청 중 오류가 발생했습니다.';
      
      // 409 에러: 이미 존재하는 이메일
      if (error.response.status === 409) {
        return {
          success: false,
          message: '이미 존재하는 이메일입니다.',
        };
      }
      // 400 에러: 마이페이지에서 이미 가입된 이메일 인증 요청
      else if (error.response.status === 400) {
        if (errorMessage.includes('가입') || errorMessage.includes('존재')) {
          return {
            success: false,
            message: '이미 가입되어 있는 이메일입니다.',
          };
        }
        return {
          success: false,
          message: errorMessage,
        };
      }
      return {
        success: false,
        message: errorMessage,
      };
    }
    return {
      success: false,
      message: error.message || '이메일 인증 요청 중 오류가 발생했습니다.',
    };
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
      const errorMessage = error.response.message || '이메일 인증 검증 중 오류가 발생했습니다.';
      
      // 400 에러: 잘못된 인증번호 또는 만료된 인증번호
      if (error.response.status === 400) {
        if (errorMessage.includes('만료') || errorMessage.includes('요청되지 않았')) {
          return {
            success: false,
            message: '인증번호가 만료되었거나 요청되지 않았습니다. 새로 인증을 요청해 주세요.',
          };
        } else if (errorMessage.includes('가입') || errorMessage.includes('존재')) {
          return {
            success: false,
            message: '이미 가입되어 있는 이메일입니다.',
          };
        } else {
          return {
            success: false,
            message: '인증번호가 일치하지 않습니다. 다시 확인해 주세요.',
          };
        }
      } else if (error.response.status === 409) {
        return {
          success: false,
          message: '이미 가입되어 있는 이메일입니다.',
        };
      }
      
      // 기본 에러 메시지 확인 및 구체화
      if (errorMessage.includes('인증에 실패했습니다')) {
        return {
          success: false,
          message: '이미 가입되어 있는 이메일입니다.',
        };
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
    return {
      success: false,
      message: error.message || '이메일 인증 검증 중 오류가 발생했습니다.',
    };
  }
};
