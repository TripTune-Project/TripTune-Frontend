import { get, post, remove } from './api';
import {
  ApiResponse,
  AttendeeList,
  LeaveSchedule,
  ShareSchedule,
} from '@/types/scheduleType';

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
    data: null as unknown as T
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

// 일정 참석자 조회
export const fetchScheduleAttendees = async (
  scheduleId: number
): Promise<ApiResponse<AttendeeList>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;

  try {
    const data = await get<ApiResponse<AttendeeList>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '참석자 조회 성공:' : '참석자 조회 실패:',
      data.message
    );
    return data;
  } catch (err: any) {
    const { message, code } = getErrorMessage(err?.status);
    return handleApiError<AttendeeList>(err, message, code);
  }
};

// 일정 공유하기 (POST)
export const shareSchedule = async (
  scheduleId: number,
  email: string,
  permission: 'ALL' | 'EDIT' | 'CHAT' | 'READ'
): Promise<ApiResponse<ShareSchedule>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;

  try {
    const data = await post<ApiResponse<ShareSchedule>>(
      url,
      { email, permission },
      { requiresAuth: true }
    );
    console.log(
      data.success ? '일정 공유 성공:' : '일정 공유 실패:',
      data.message
    );
    return data;
  } catch (err: any) {
    const { message, code } = getErrorMessage(err?.status);
    return handleApiError<ShareSchedule>(err, message, code);
  }
};

// 일정 나가기 (DELETE)
export const leaveSchedule = async (
  scheduleId: number
): Promise<ApiResponse<LeaveSchedule>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;

  try {
    const data = await remove<ApiResponse<LeaveSchedule>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '일정 나가기 성공:' : '일정 나가기 실패:',
      data.message
    );
    return data;
  } catch (err: any) {
    if (err?.status === 403 && err?.message === '작성자 나가기 금지') {
      return handleApiError<LeaveSchedule>(
        err,
        '작성자는 일정에서 나갈 수 없습니다.',
        403
      );
    }
    const { message, code } = getErrorMessage(err?.status);
    return handleApiError<LeaveSchedule>(err, message, code);
  }
};
