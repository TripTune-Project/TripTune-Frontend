import { get, post, patch, remove } from '../Common/api';
import {
  ApiResponse,
  ScheduleList,
  ScheduleDetail,
  CreateSchedule,
  UpdateSchedule,
  SchedulePreviewResponse,
} from '@/types/scheduleType';
import { handleApiError } from '@/apis/Common/errorHandler';

// 1. 일정 목록 조회 (GET)
export const fetchScheduleList = async (
  page: number = 1
): Promise<ApiResponse<ScheduleList>> => {
  const url = `/api/schedules?page=${page}`;

  try {
    const data = await get<ApiResponse<ScheduleList>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '일정 목록 조회 성공:' : '일정 목록 조회 실패:',
      data.message
    );
    return data;
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
    const data = await get<ApiResponse<ScheduleList>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '공유 일정 목록 조회 성공:' : '공유 일정 목록 조회 실패:',
      data.message
    );
    return data;
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
    const data = await get<ApiResponse<ScheduleList>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '일정 검색 성공:' : '일정 검색 실패:',
      data.message
    );
    return data;
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
    const data = await get<ApiResponse<ScheduleDetail>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '일정 조회 성공:' : '일정 조회 실패:',
      data.message
    );
    return data;
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
    const data = await post<ApiResponse<CreateSchedule>>(url, scheduleData, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '일정 생성 성공:' : '일정 생성 실패:',
      data.message
    );
    return data;
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
    const data = await patch<ApiResponse<UpdateSchedule>>(url, requestBody, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '일정 수정 성공:' : '일정 수정 실패:',
      data.message
    );
    return data;
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
    const data = await remove<ApiResponse<null>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '일정 삭제 성공:' : '일정 삭제 실패:',
      data.message
    );
    return data;
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
    const data = await get<ApiResponse<SchedulePreviewResponse>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success
        ? `일정 목록 조회 성공 (현재 페이지: ${data.data?.currentPage})`
        : '일정 목록 조회 실패:',
      data.message
    );
    return data;
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
    const data = await post<ApiResponse<null>>(
      url,
      { placeId },
      {
        requiresAuth: true,
      }
    );
    console.log(
      data.success ? '여행지 추가 성공:' : '여행지 추가 실패:',
      data.message
    );
    return data;
  } catch (error: unknown) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
