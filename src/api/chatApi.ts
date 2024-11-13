// 채팅 조회하기
import { get, post } from './api';
import { ApiResponse } from '@/types/scheduleType';

// TODO : ChatType: 개별 채팅 항목의 타입
interface ChatType {
  id: number;
  message: string;
  senderId: number;
  senderName: string;
  createdAt: string;
}

// TODO : ChatListType: 채팅 목록의 타입
interface ChatListType {
  chats: ChatType[];
  currentPage: number;
  totalPages: number;
  totalChats: number;
}

const handleApiError = (error: unknown, defaultMessage: string) => {
  console.error(
    error instanceof Error ? error.message : '알 수 없는 오류 발생'
  );
  return {
    success: false,
    errorCode: 500,
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
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 채팅 보내기
export const sendScheduleChat = async (
  scheduleId: number,
  chatMessage: string
): Promise<ApiResponse<ChatType>> => {
  const url = `/schedules/${scheduleId}/chats`;

  try {
    const data = await post<ApiResponse<ChatType>>(
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
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
