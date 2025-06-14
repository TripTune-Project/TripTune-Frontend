import { post } from '../api';

export interface EmailApiResponse {
  message: string;
  success: boolean;
  error?: string;
  isVerified?: boolean;
}

export interface EmailVerificationState {
  isVerified: boolean;
  isRequested: boolean;
  email: string;
}

// 이메일 인증 상태를 저장할 Map
const emailVerificationStates = new Map<string, EmailVerificationState>();

export const getEmailVerificationState = (email: string): EmailVerificationState => {
  return emailVerificationStates.get(email) || {
    isVerified: false,
    isRequested: false,
    email
  };
};

export const updateEmailVerificationState = (
  email: string,
  state: Partial<EmailVerificationState>
): EmailVerificationState => {
  const currentState = getEmailVerificationState(email);
  const newState = { ...currentState, ...state };
  emailVerificationStates.set(email, newState);
  return newState;
};

export const resetEmailVerificationState = (email: string): void => {
  emailVerificationStates.delete(email);
};

export const requestEmailVerification = async (
  email: string
): Promise<EmailApiResponse> => {
  try {
    const response = await post<EmailApiResponse>('/api/emails/verify-request', {
      email,
    });
    
    // 인증 요청 성공 시 상태 업데이트
    updateEmailVerificationState(email, {
      isRequested: true,
      isVerified: false
    });

    return {
      ...response,
      success: true,
      isVerified: false
    };
  } catch (error: any) {
    if (error.response?.data) {
      const errorMessage = error.response.data.message || '이메일 인증 요청 중 오류가 발생했습니다.';
      
      // 409 에러: 이미 존재하는 이메일
      if (error.response.status === 409) {
        return {
          success: false,
          message: '이미 존재하는 이메일입니다.',
          error: 'DUPLICATE_EMAIL',
          isVerified: false
        };
      }
      // 400 에러: 마이페이지에서 이미 가입된 이메일 인증 요청
      else if (error.response.status === 400) {
        if (errorMessage.includes('가입') || errorMessage.includes('존재')) {
          return {
            success: false,
            message: '이미 가입되어 있는 이메일입니다.',
            error: 'ALREADY_REGISTERED',
            isVerified: false
          };
        }
        return {
          success: false,
          message: errorMessage,
          error: 'INVALID_REQUEST',
          isVerified: false
        };
      }
      return {
        success: false,
        message: errorMessage,
        error: 'UNKNOWN_ERROR',
        isVerified: false
      };
    }
    return {
      success: false,
      message: error.message || '이메일 인증 요청 중 오류가 발생했습니다.',
      error: 'UNKNOWN_ERROR',
      isVerified: false
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
    const response = await post<EmailApiResponse>('/api/emails/verify', {
      email,
      authCode,
    });

    // 인증 성공 시 상태 업데이트
    updateEmailVerificationState(email, {
      isVerified: true,
      isRequested: true
    });

    return {
      ...response,
      success: true,
      isVerified: true
    };
  } catch (error: any) {
    if (error.response?.data) {
      const errorMessage = error.response.data.message || '이메일 인증 검증 중 오류가 발생했습니다.';
      
      // 400 에러: 잘못된 인증번호 또는 만료된 인증번호
      if (error.response.status === 400) {
        if (errorMessage.includes('만료') || errorMessage.includes('요청되지 않았')) {
          // 만료된 경우 상태 초기화
          resetEmailVerificationState(email);
          return {
            success: false,
            message: '인증번호가 만료되었거나 요청되지 않았습니다. 새로 인증을 요청해 주세요.',
            error: 'EXPIRED_CODE',
            isVerified: false
          };
        } else if (errorMessage.includes('가입') || errorMessage.includes('존재')) {
          return {
            success: false,
            message: '이미 가입되어 있는 이메일입니다.',
            error: 'ALREADY_REGISTERED',
            isVerified: false
          };
        } else {
          return {
            success: false,
            message: '인증번호가 일치하지 않습니다. 다시 확인해 주세요.',
            error: 'INVALID_CODE',
            isVerified: false
          };
        }
      } else if (error.response.status === 409) {
        return {
          success: false,
          message: '이미 가입되어 있는 이메일입니다.',
          error: 'ALREADY_REGISTERED',
          isVerified: false
        };
      }
      
      return {
        success: false,
        message: errorMessage,
        error: 'UNKNOWN_ERROR',
        isVerified: false
      };
    }
    return {
      success: false,
      message: error.message || '이메일 인증 검증 중 오류가 발생했습니다.',
      error: 'UNKNOWN_ERROR',
      isVerified: false
    };
  }
};
