import { ScheduleTravelResultType, ApiResponse } from '@/types/scheduleType';
import { get } from './api';

const handleApiError = (error: unknown, defaultMessage: string) => {
  console.error(
    error instanceof Error ? error.message : '알 수 없는 오류 발생'
  );
  return {
    success: false,
    errorCode: 500,
    message: defaultMessage,
  };
};

// 여행지 조회 (GET)
export const fetchTravelList = async (
  scheduleId: number,
  page = 1
): Promise<ApiResponse<ScheduleTravelResultType>> => {
  const url = `/schedules/${scheduleId}/travels?page=${page}`;

  try {
    const data = await get<ApiResponse<ScheduleTravelResultType>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '여행지 조회 성공:' : '여행지 조회 실패:',
      data.message
    );
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 여행지 검색 (GET)
export const searchTravelDestinations = async (
  scheduleId: number,
  page = 1,
  keyword: string
): Promise<ApiResponse<ScheduleTravelResultType>> => {
  const url = `/schedules/${scheduleId}/travels/search?page=${page}&keyword=${keyword}`;

  try {
    const data = await get<ApiResponse<ScheduleTravelResultType>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '여행지 검색 성공:' : '여행지 검색 실패:',
      data.message
    );
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 여행 루트 조회 (GET)
export const fetchTravelRoute = async (
  scheduleId: number,
  page = 1
): Promise<ApiResponse<ScheduleTravelResultType>> => {
  const url = `/schedules/${scheduleId}/routes?page=${page}`;

  try {
    const data = await get<ApiResponse<ScheduleTravelResultType>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '여행 루트 조회 성공:' : '여행 루트 조회 실패:',
      data.message
    );
    return data;
  } catch (error) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
