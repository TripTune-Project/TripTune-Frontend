import { get, patch, post, remove } from '../Common/api';
import {
  ApiResponse,
  CreateSchedule,
  ScheduleDetail,
  ScheduleList,
  SchedulePreviewResponse,
  UpdateSchedule,
} from '@/types/scheduleType';
import { handleApiError } from '@/apis/Common/errorHandler';

// 1. 일정 목록 조회 (GET)
export const fetchScheduleList = async (
  page: number = 1
): Promise<ApiResponse<ScheduleList>> => {
  const url = `/api/schedules?page=${page}`;

  try {
    return await get<ApiResponse<ScheduleList>>(url, {
      requiresAuth: true,
    });
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 2. 공유 일정 목록 조회 (GET)
export const fetchSharedScheduleList = async (
  page: number = 1
): Promise<ApiResponse<ScheduleList>> => {
  const url = `/api/schedules/shared?page=${page}`;

  try {
    return await get<ApiResponse<ScheduleList>>(url, {
      requiresAuth: true,
    });
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 3. 일정 목록 중 검색 (GET)
export const fetchScheduleListSearch = async (
  page: number = 1,
  keyword: string,
  type: 'all' | 'share' = 'all'
): Promise<ApiResponse<ScheduleList>> => {
  const url = `/api/schedules/search?page=${page}&keyword=${encodeURIComponent(keyword)}&type=${type}`;

  try {
    return await get<ApiResponse<ScheduleList>>(url, {
      requiresAuth: true,
    });
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 4. 일정 상세 조회 (GET)
export const fetchScheduleDetail = async (
  scheduleId: number,
  page: number = 1
): Promise<ApiResponse<ScheduleDetail>> => {
  const url = `/api/schedules/${scheduleId}?page=${page}`;

  try {
    return await get<ApiResponse<ScheduleDetail>>(url, {
      requiresAuth: true,
    });
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 5. 일정 만들기 생성 (POST)
export const createNewSchedule = async (
  scheduleData: CreateSchedule
): Promise<ApiResponse<CreateSchedule>> => {
  const url = '/api/schedules';

  try {
    return await post<ApiResponse<CreateSchedule>>(url, scheduleData, {
      requiresAuth: true,
    });
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
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
    travelRoute: schedule.travelRoute,
  };

  try {
    return await patch<ApiResponse<UpdateSchedule>>(url, requestBody, {
      requiresAuth: true,
    });
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 7. 일정 삭제 (DELETE)
export const deleteSchedule = async (
  scheduleId: number
): Promise<ApiResponse<null>> => {
  const url = `/api/schedules/${scheduleId}`;

  try {
    return await remove<ApiResponse<null>>(url, {
      requiresAuth: true,
    });
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 8. 내 일정 목록 조회 (모달창)
export const fetchSchedulesPreview = async (
  page: number
): Promise<ApiResponse<SchedulePreviewResponse>> => {
  const url = `/api/schedules/edit?page=${page}`;

  try {
    return await get<ApiResponse<SchedulePreviewResponse>>(url, {
      requiresAuth: true,
    });
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 9. 내 일정 담기
export const addPlaceToSchedule = async (
  scheduleId: number,
  placeId: number
): Promise<ApiResponse<null>> => {
  const url = `/api/schedules/${scheduleId}/routes`;

  try {
    return await post<ApiResponse<null>>(
      url,
      { placeId },
      {
        requiresAuth: true,
      }
    );
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
