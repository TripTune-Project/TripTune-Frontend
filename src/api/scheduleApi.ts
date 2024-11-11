import { get, post, patch, remove } from './api';
import {
  ApiResponse,
  ScheduleAllListType,
  ScheduleType,
  ScheduleDetailType,
  ScheduleTravelResultType,
} from '@/types/scheduleType';

const handleApiError = (error: unknown, defaultMessage: string) => {
  console.error(error instanceof Error ? error.message : '알 수 없는 오류 발생');
  return {
    success: false,
    errorCode: 500,
    message: defaultMessage,
  };
};

// 일정 목록 조회 (GET)
export const fetchScheduleList = async (
  page: number = 1,
  type: string = 'all'
): Promise<ApiResponse<ScheduleAllListType>> => {
  const url = `/api/schedules?page=${page}&type=${type}`;
  
  try {
    const data = await get<ApiResponse<ScheduleAllListType>>(url, {
      requiresAuth: true,
    });
    console.log(data.success ? '일정 목록 조회 성공:' : '일정 목록 조회 실패:', data.message);
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 일정 목록 중 검색 (GET)
export const fetchScheduleListSearch = async (
  page = 1,
  keyword: string,
  type: string = 'all' // 'all' 혹은 'share'로 설정 가능
): Promise<ApiResponse<ScheduleTravelResultType>> => {
  const url = `/api/schedules/search?page=${page}&keyword=${keyword}&type=${type}`;
  
  try {
    const data = await get<ApiResponse<ScheduleTravelResultType>>(url, {
      requiresAuth: true,
    });
    console.log(data.success ? '최근 일정 검색 성공:' : '최근 일정 검색 실패:', data.message);
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 일정 상세 조회 (GET)
export const fetchScheduleDetail = async (
  scheduleId: number,
  page: number = 1
): Promise<ApiResponse<ScheduleDetailType>> => {
  const url = `/api/schedules/${scheduleId}?page=${page}`;
  
  try {
    const data = await get<ApiResponse<ScheduleDetailType>>(url, {
      requiresAuth: true,
    });
    console.log(data.success ? '일정 조회 성공:' : '일정 조회 실패:', data.message);
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 일정 만들기 생성 (POST)
export const createNewSchedule = async (
  scheduleData: ScheduleType
): Promise<ApiResponse<ScheduleType>> => {
  const url = '/api/schedules';
  
  try {
    const data = await post<ApiResponse<ScheduleType>>(url, scheduleData, {
      requiresAuth: true,
    });
    console.log(data.success ? '일정 생성 성공:' : '일정 생성 실패:', data.message);
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 일정 만들기 수정 / 저장 (PATCH)
export const updateExistingSchedule = async (
  schedule: ScheduleDetailType
): Promise<ApiResponse<ScheduleDetailType>> => {
  const url = `/api/schedules/${schedule.scheduleId}`;
  
  try {
    const data = await patch<ApiResponse<ScheduleDetailType>>(
      url,
      {
        scheduleName: schedule.scheduleName,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
      },
      { requiresAuth: true }
    );
    console.log(data.success ? '일정 수정 성공:' : '일정 수정 실패:', data.message);
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 일정 삭제 (DELETE)
export const deleteSchedule = async (
  scheduleId: number
): Promise<ApiResponse<null>> => {
  const url = `/api/schedules/${scheduleId}`;
  
  try {
    const data = await remove<ApiResponse<null>>(url, {
      requiresAuth: true,
    });
    console.log(data.success ? '일정 삭제 성공:' : '일정 삭제 실패:', data.message);
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
