import { ApiResponse } from '@/types/scheduleType';
import { get, post, remove } from './api';

const handleApiError = (
  error: unknown,
  defaultMessage: string,
  errorCode: number = 500
): ApiResponse<null> => {
  console.error(
    error instanceof Error ? error.message : '알 수 없는 오류 발생'
  );
  return {
    success: false,
    errorCode,
    message: defaultMessage,
  };
};

const getErrorMessage = (status: number): { message: string; code: number } => {
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
    messages[status] || {
      message: '서버 내부 오류가 발생하였습니다.',
      code: 500,
    }
  );
};

// 일정 참석자 조회
export const fetchScheduleAttendees = async (
  scheduleId: number
): Promise<ApiResponse<null>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;

  try {
    const data = await get<ApiResponse<null>>(url, { requiresAuth: true });
    console.log(
      data.success ? '참석자 조회 성공:' : '참석자 조회 실패:',
      data.message
    );
    return data;
  } catch (error: any) {
    const { message, code } = getErrorMessage(error?.status);
    return handleApiError(error, message, code);
  }
};

// 일정 공유하기 (POST)
export const shareSchedule = async (
  scheduleId: number,
  email: string,
  permission: 'ALL' | 'EDIT' | 'CHAT' | 'READ'
): Promise<ApiResponse<null>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;

  try {
    const data = await post<ApiResponse<null>>(
      url,
      { email, permission },
      { requiresAuth: true }
    );
    console.log(
      data.success ? '일정 공유 성공:' : '일정 공유 실패:',
      data.message
    );
    return data;
  } catch (error: any) {
    const { message, code } = getErrorMessage(error?.status);
    return handleApiError(error, message, code);
  }
};

// 일정 나가기 (DELETE)
export const leaveSchedule = async (
  scheduleId: number
): Promise<ApiResponse<null>> => {
  const url = `/schedules/${scheduleId}/attendees`;

  try {
    const data = await remove<ApiResponse<null>>(url, { requiresAuth: true });
    console.log(
      data.success ? '일정 나가기 성공:' : '일정 나가기 실패:',
      data.message
    );
    return data;
  } catch (error: any) {
    if (error?.status === 403 && error?.message === '작성자 나가기 금지') {
      return handleApiError(error, '작성자는 일정에서 나갈 수 없습니다.', 403);
    }
    const { message, code } = getErrorMessage(error?.status);
    return handleApiError(error, message, code);
  }
};
