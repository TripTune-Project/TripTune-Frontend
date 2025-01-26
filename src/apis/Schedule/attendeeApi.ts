import { get, patch, post, remove } from '../api';
import {
  ApiResponse,
  Attendee,
  LeaveSchedule,
  ShareSchedule,
} from '@/types/scheduleType';

// 일정 참석자 조회
export const fetchScheduleAttendees = async (
  scheduleId: number
): Promise<ApiResponse<Attendee[]>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;
  return await get<ApiResponse<Attendee[]>>(url, {
    requiresAuth: true,
  });
};

// 일정 공유하기 (POST)
export const shareSchedule = async (
  scheduleId: number,
  email: string,
  permission: 'ALL' | 'EDIT' | 'CHAT' | 'READ'
): Promise<ApiResponse<ShareSchedule>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;
  return await post<ApiResponse<ShareSchedule>>(
    url,
    { email, permission },
    { requiresAuth: true }
  );
};

// 일정 접근 권한 수정하기 (PATCH)
export const updatePermission = async (
  scheduleId: number,
  attendeeId: number,
  permission: 'ALL' | 'EDIT' | 'CHAT' | 'READ'
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const url = `/api/schedules/${scheduleId}/attendees/${attendeeId}`;
  return await patch<ApiResponse<{ success: boolean; message: string }>>(
    url,
    { permission },
    { requiresAuth: true }
  );
};

// 일정 나가기 (DELETE)
export const leaveSchedule = async (
  scheduleId: number
): Promise<ApiResponse<LeaveSchedule>> => {
  const url = `/api/schedules/${scheduleId}/attendees`;
  return await remove<ApiResponse<LeaveSchedule>>(url, {
    requiresAuth: true,
  });
};
