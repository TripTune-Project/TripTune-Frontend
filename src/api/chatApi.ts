import { get } from './api';
import { ApiResponse, ChatList } from '@/types/scheduleType';

// 오류 처리 함수가 반환 타입을 동적으로 지원하도록 수정
const handleApiError = <T>(
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
    data: null as unknown as T, // 동적 타입 반환을 위한 처리
  };
};

const getErrorMessage = (
  status?: number
): { message: string; code: number } => {
  const messages: Record<number, { message: string; code: number }> = {
    403: {
      message: '해당 일정에 접근 권한이 없는 사용자입니다.',
      code: 403,
    },
    404: {
      message: '일정 데이터가 존재하지 않습니다.',
      code: 404,
    },
    409: {
      message: '이미 공유되어 있는 사용자입니다.',
      code: 409,
    },
  };

  return (
    messages[status || 500] || {
      message: '서버 내부 오류가 발생하였습니다.',
      code: 500,
    }
  );
};

// 채팅 목록 조회 (GET)
export const fetchScheduleChats = async (
  scheduleId: number,
  page: number = 1
): Promise<ApiResponse<ChatList>> => {
  const url = `/api/schedules/${scheduleId}/chats?page=${page}`;

  try {
    const data = await get<ApiResponse<ChatList>>(url, {
      requiresAuth: true,
    });

    console.log(
      data.success ? '채팅 목록 조회 성공:' : '채팅 목록 조회 실패:',
      data.message
    );
    return data;
  } catch (error: any) {
    if (error.status === 404) {
      return handleApiError(error, '일정 데이터가 존재하지 않습니다.', 404);
    }
    if (error.status === 403) {
      return handleApiError(
        error,
        '해당 일정에 접근 권한이 없는 사용자입니다.',
        403
      );
    }
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.', 500);
  }
};
