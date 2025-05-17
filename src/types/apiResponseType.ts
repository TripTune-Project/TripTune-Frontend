/**
 * 성공 응답 타입 정의
 *
 * @template T - 응답 데이터의 타입
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * 실패 응답 타입 정의
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errorCode?: number;
}

/**
 * API 응답 공통 타입 정의
 *
 * @template T - 성공 시 응답 데이터의 타입
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
