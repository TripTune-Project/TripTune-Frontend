import { get, post, patch, remove } from './api';
import {
  ApiResponse,
  ScheduleList,
  ScheduleDetail,
  CreateSchedule,
  UpdateSchedule,
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
    data: null as unknown as T, // 동적 타입 반환을 위한 처리
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
