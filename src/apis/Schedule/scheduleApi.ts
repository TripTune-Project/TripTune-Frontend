import { get, patch, post, remove } from '../api';
import {
  ApiResponse,
  CreateSchedule,
  ScheduleDetail,
  ScheduleList,
  SchedulePreviewResponse,
  UpdateSchedule,
} from '@/types/scheduleType';

// 1. 일정 목록 조회 (GET)
export const fetchScheduleList = async (
  page: number = 1
): Promise<ApiResponse<ScheduleList>> => {
  const url = `/api/schedules?page=${page}`;
  return await get(url, {
    requiresAuth: true,
  });
};

// 2. 공유 일정 목록 조회 (GET)
export const fetchSharedScheduleList = async (
  page: number = 1
): Promise<ApiResponse<ScheduleList>> => {
  const url = `/api/schedules/shared?page=${page}`;
  return await get(url, { requiresAuth: true });
};

// 3. 일정 목록 중 검색 (GET)
export const fetchScheduleListSearch = async (
  page: number = 1,
  keyword: string,
  type: 'all' | 'share' = 'all'
): Promise<ApiResponse<ScheduleList>> => {
  const url = `/api/schedules/search?page=${page}&keyword=${encodeURIComponent(keyword)}&type=${type}`;
  return await get(url, { requiresAuth: true });
};

// 4. 일정 상세 조회 (GET)
export const fetchScheduleDetail = async (
  scheduleId: number,
  page: number = 1
): Promise<ApiResponse<ScheduleDetail>> => {
  const url = `/api/schedules/${scheduleId}?page=${page}`;
  const response: ApiResponse<ScheduleDetail> = await get(url, {
    requiresAuth: true,
  });
  if (!response.success && response.message === '일정이 존재하지 않습니다.') {
    throw new Error('일정이 존재하지 않습니다.');
  }
  return response;
};

// 5. 일정 만들기 생성 (POST)
export const createNewSchedule = async (
  scheduleData: CreateSchedule
): Promise<ApiResponse<CreateSchedule>> => {
  const url = '/api/schedules';
  return await post(url, scheduleData, { requiresAuth: true });
};

// 6. 일정 만들기 수정 / 저장 (PATCH)
export const updateExistingSchedule = async (
  schedule: UpdateSchedule
): Promise<ApiResponse<UpdateSchedule>> => {
  const url = `/api/schedules/${schedule.scheduleId}`;

  const requestBody: UpdateSchedule = {
    scheduleId: schedule.scheduleId,
    scheduleName: schedule.scheduleName,
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    travelRoutes: schedule.travelRoutes,
  };
  return await patch(url, requestBody, { requiresAuth: true });
};

// 7. 일정 삭제 (DELETE)
export const deleteSchedule = async (
  scheduleId: number
): Promise<ApiResponse<null>> => {
  const url = `/api/schedules/${scheduleId}`;
  return await remove(url, undefined,  { requiresAuth: true });
};

// 8. 내 일정 목록 조회 (모달창)
export const fetchSchedulesPreview = async (
  page: number
): Promise<ApiResponse<SchedulePreviewResponse>> => {
  const url = `/api/schedules/edit?page=${page}`;
  return await get(url, { requiresAuth: true });
};

// 9. 내 일정 담기
export const addPlaceToSchedule = async (
  scheduleId: number,
  placeId: number
): Promise<ApiResponse<null>> => {
  const url = `/api/schedules/${scheduleId}/routes`;
  return await post(url, { placeId }, { requiresAuth: true });
};
