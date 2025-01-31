import { get } from '../api';
import { ApiResponse, ChatList } from '@/types/scheduleType';

// 채팅 목록 조회 (GET)
export const fetchScheduleChats = async (
  scheduleId: number,
  page: number = 1
): Promise<ApiResponse<ChatList>> => {
  const url = `/api/schedules/${scheduleId}/chats?page=${page}`;
  return await get<ApiResponse<ChatList>>(url, {
    requiresAuth: true,
  });
};
