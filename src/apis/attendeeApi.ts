import { get, patch, post, remove } from './Common/api';
import {
  ApiResponse,
  Attendee,
  LeaveSchedule,
  ShareSchedule,
} from '@/types/scheduleType';
import { handleApiError } from '@/apis/Common/errorHandler';

// 일정 참석자 조회
export const fetchScheduleAttendees = async (
  scheduleId: number
): Promise<ApiResponse<Attendee[]>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;

  try {
    const data = await get<ApiResponse<Attendee[]>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '참석자 조회 성공:' : '참석자 조회 실패:',
      data.message
    );
    return data;
  } catch (error: any) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
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
  } catch (error: any) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 일정 접근 권한 수정하기 (PATCH)
export const updatePermission = async (
  scheduleId: number,
  attendeeId: number,
  permission: 'ALL' | 'EDIT' | 'CHAT' | 'READ'
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const url = `/api/schedules/${scheduleId}/attendees/${attendeeId}`;

  try {
    const data = await patch<
      ApiResponse<{ success: boolean; message: string }>
    >(url, { permission }, { requiresAuth: true });
    console.log(
      data.success ? '접근 권한 수정 성공:' : '접근 권한 수정 실패:',
      data.message
    );
    return data;
  } catch (error: any) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
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
  } catch (error: any) {
    if (error?.status === 403 && error?.message === '작성자 나가기 금지') {
      return handleApiError<LeaveSchedule>(
        error,
        '작성자는 일정에서 나갈 수 없습니다.',
        403
      );
    }
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
