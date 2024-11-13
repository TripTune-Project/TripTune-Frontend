import { ApiResponse } from '@/types/scheduleType';
import { get, post, remove } from './api';

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

// (회의 후 존재 여부 결정) 일정 참석자 조회
export const fetchScheduleAttendees = async (
  scheduleId: number,
  userId: string,
  permission: 'ALL' | 'EDIT' | 'CHAT' | 'READ'
): Promise<ApiResponse<null>> => {
  const url = `/schedules/${scheduleId}/attendees?userId=${userId}&permission=${permission}`;
  
  try {
    const data = await get<ApiResponse<null>>(url, { requiresAuth: true });
    console.log(
      data.success ? '참석자 조회 성공:' : '참석자 조회 실패:',
      data.message
    );
    return data;
  } catch (error) {
    // 404 Not Found
    if ((error as any).status === 404) {
      return handleApiError(error, '일정 데이터가 존재하지 않습니다.', 404);
    }
    // 403 Forbidden
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

// 일정 공유하기 (POST)
export const shareSchedule = async (
  scheduleId: number,
  userId: string,
  permission: 'ALL' | 'EDIT' | 'CHAT' | 'READ'
): Promise<ApiResponse<null>> => {
  const url = `/schedules/${scheduleId}/attendees`;
  
  try {
    const data = await post<ApiResponse<null>>(
      url,
      { userId, permission },
      { requiresAuth: true }
    );
    console.log(
      data.success ? '일정 공유 성공:' : '일정 공유 실패:',
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
    // 409 Conflict - 이미 공유된 사용자
    if ((error as any).status === 409) {
      return handleApiError(
        error,
        '이미 공유되어 있는 사용자입니다.',
        409
      );
    }
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
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
  } catch (error) {
    // 404 Not Found
    if ((error as any).status === 404) {
      return handleApiError(error, '일정 데이터가 존재하지 않습니다.', 404);
    }
    // 403 Forbidden - 접근 권한 없음
    if ((error as any).status === 403) {
      // 타입이 Error인지 체크 후 접근
      if (error instanceof Error && error.message === '작성자 나가기 금지') {
        return handleApiError(
          error,
          '작성자는 일정에서 나갈 수 없습니다.',
          403
        );
      }
      return handleApiError(
        error,
        '해당 일정에 접근 권한이 없는 사용자입니다.',
        403
      );
    }
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
