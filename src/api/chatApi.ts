import { get, post } from './api';
import { ApiResponse, ChatUserType } from '@/types/scheduleType';

interface ChatListType {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  content: ChatUserType[];
}

// 기본 오류 처리 함수
const handleApiError = (
  error: unknown,
  defaultMessage: string,
  errorCode?: number
) => {
  console.error(
    error instanceof Error ? error.message : '알 수 없는 오류 발생'
  );
  return {
    success: false,
    errorCode: errorCode || 500,
    message: defaultMessage,
  };
};

// 채팅 목록 조회 (GET)
export const fetchScheduleChats = async (
  scheduleId: number,
  page: number = 1
): Promise<ApiResponse<ChatListType>> => {
  const url = `/schedules/${scheduleId}/chats?page=${page}`;

  try {
    const data = await get<ApiResponse<ChatListType>>(url, {
      requiresAuth: true,
    });

    console.log(
      data.success ? '채팅 목록 조회 성공:' : '채팅 목록 조회 실패:',
      data.message
    );
    return data;
  } catch (error) {
    if ((error as any).status === 404) {
      return handleApiError(error, '일정 데이터가 존재하지 않습니다.', 404);
    }
    if ((error as any).status === 403) {
      return handleApiError(
        error,
        '해당 일정에 접근 권한이 없는 사용자입니다.',
        403
      );
    }
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.', 500);
  }
};

// 채팅 보내기 (POST)
export const sendScheduleChat = async (
  scheduleId: number,
  nickname: string,
  chatMessage: string
): Promise<ApiResponse<any>> => {
  // TODO : CORS 에러 발생
  const url = `/pub/chats`;
  try {
    const data = await post<ApiResponse<any>>(
      url,
      {
        scheduleId,
        nickname,
        message: chatMessage,
      },
      { requiresAuth: true }
    );
    console.log(
      data.success ? '채팅 전송 성공:' : '채팅 전송 실패:',
      data.message
    );
    return data;
  } catch (error) {
    if ((error as any).status === 404) {
      return handleApiError(error, '일정 데이터가 존재하지 않습니다.', 404);
    }
    if ((error as any).status === 403) {
      return handleApiError(
        error,
        '해당 일정에 접근 권한이 없는 사용자입니다.',
        403
      );
    }
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
