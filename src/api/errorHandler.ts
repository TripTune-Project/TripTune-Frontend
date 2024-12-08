interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: number;
}

// 오류 처리 함수가 반환 타입을 동적으로 지원하도록 수정
export const handleApiError = <T>(
  error: unknown,
  defaultMessage: string,
  errorCode: number = 500
): ApiResponse<T> => {
  const errorMessage =
    error instanceof Error ? error.message : '알 수 없는 오류 발생';

  console.error(errorMessage);

  return {
    success: false,
    errorCode,
    message: defaultMessage,
    data: null as unknown as T,
  };
};
