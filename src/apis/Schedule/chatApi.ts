import { get } from '../Common/api';
import { ApiResponse, ChatList } from '@/types/scheduleType';
import { handleApiError } from '@/apis/Common/errorHandler';

// 채팅 목록 조회 (GET)
export const fetchScheduleChats = async (
  scheduleId: number,
  page: number = 1
): Promise<ApiResponse<ChatList>> => {
  const url = `/api/schedules/${scheduleId}/chats?page=${page}`;

  try {
    return await get<ApiResponse<ChatList>>(url, {
      requiresAuth: true,
    });
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
