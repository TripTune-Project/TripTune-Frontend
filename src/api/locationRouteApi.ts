import { get } from './api';
import {
  ApiResponse,
  ScheduleTravelList,
  RouteList,
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

// 여행지 조회 (GET)
export const fetchTravelList = async (
  scheduleId: number,
  page = 1
): Promise<ApiResponse<ScheduleTravelList>> => {
  const url = `/api/schedules/${scheduleId}/travels?page=${page}`;

  try {
    const data = await get<ApiResponse<ScheduleTravelList>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '여행지 조회 성공:' : '여행지 조회 실패:',
      data.message
    );
    return data;
  } catch (error: any) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 여행지 검색 (GET)
export const searchTravelDestinations = async (
  scheduleId: number,
  page = 1,
  keyword: string
): Promise<ApiResponse<ScheduleTravelList>> => {
  const url = `/api/schedules/${scheduleId}/travels/search?page=${page}&keyword=${encodeURIComponent(keyword)}`;

  try {
    const data = await get<ApiResponse<ScheduleTravelList>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '여행지 검색 성공:' : '여행지 검색 실패:',
      data.message
    );
    return data;
  } catch (error: any) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};

// 여행 루트 조회 (GET)
export const fetchTravelRoute = async (
  scheduleId: number,
  page = 1
): Promise<ApiResponse<RouteList>> => {
  const url = `/api/schedules/${scheduleId}/routes?page=${page}`;

  try {
    const data = await get<ApiResponse<RouteList>>(url, {
      requiresAuth: true,
    });
    console.log(
      data.success ? '여행 루트 조회 성공:' : '여행 루트 조회 실패:',
      data.message
    );
    return data;
  } catch (error: any) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
