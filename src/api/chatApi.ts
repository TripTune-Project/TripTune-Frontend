import { get, post } from './api';
import { ApiResponse } from '@/types/scheduleType';

// 채팅 타입 정의
interface ChatMessageType {
  messageId: string;
  timestamp: string;
  message: string;
}

interface ChatUserType {
  nickname: string;
  profileImage: string;
  messages: ChatMessageType[];
}

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
    // 404 Not Found
    if ((error as any).status === 404) {
      return handleApiError(error, '일정 데이터가 존재하지 않습니다.', 404);
    }
    // 403 Forbidden - 접근 권한 없음
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

// 채팅 보내기 (POST)
export const sendScheduleChat = async (
  scheduleId: number,
  chatMessage: string
): Promise<ApiResponse<ChatMessageType>> => {
  const url = `/schedules/${scheduleId}/chats`;
  
  try {
    const data = await post<ApiResponse<ChatMessageType>>(
      url,
      { message: chatMessage },
      { requiresAuth: true }
    );
    console.log(
      data.success ? '채팅 전송 성공:' : '채팅 전송 실패:',
      data.message
    );
    return data;
  } catch (error) {
    // 400 Bad Request - 잘못된 요청 형식 (예: 채팅 메시지 누락)
    if ((error as any).status === 400) {
      return handleApiError(error, '잘못된 요청입니다. 채팅 메시지를 확인하세요.', 400);
    }
    // 404 Not Found
    if ((error as any).status === 404) {
      return handleApiError(error, '일정 데이터가 존재하지 않습니다.', 404);
    }
    // 403 Forbidden - 접근 권한 없음
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
