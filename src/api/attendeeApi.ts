import { ApiResponse } from '@/types/scheduleType';
import { post, remove } from './api';

const handleApiError = (error: unknown, defaultMessage: string) => {
  console.error(error instanceof Error ? error.message : '알 수 없는 오류 발생');
  return {
    success: false,
    errorCode: 500,
    message: defaultMessage,
  };
};

// 일정 공유하기 (POST)
export const shareSchedule = async (
  scheduleId: number,
  userId: string,
  permission: 'ALL' | 'EDIT' | 'CHAT' | 'READ'
): Promise<ApiResponse<null>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;
  
  try {
    const data = await post<ApiResponse<null>>(url, { userId, permission }, { requiresAuth: true });
    console.log(data.success ? '일정 공유 성공:' : '일정 공유 실패:', data.message);
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 일정 나가기 (DELETE)
export const leaveSchedule = async (scheduleId: number): Promise<ApiResponse<null>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;
  
  try {
    const data = await remove<ApiResponse<null>>(url, { requiresAuth: true });
    console.log(data.success ? '일정 나가기 성공:' : '일정 나가기 실패:', data.message);
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
