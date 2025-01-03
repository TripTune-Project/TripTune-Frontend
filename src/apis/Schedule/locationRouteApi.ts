import { get } from '../Common/api';
import {
  ApiResponse,
  ScheduleTravelList,
  RouteList,
} from '@/types/scheduleType';
import { handleApiError } from '@/apis/Common/errorHandler';

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
    const response = await get<ApiResponse<ScheduleTravelList>>(url, {
      requiresAuth: true,
    });
    console.log(
      response.success ? '여행지 검색 성공:' : '여행지 검색 실패:',
      response.message
    );
    return response;
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
    const response = await get<ApiResponse<RouteList>>(url, {
      requiresAuth: true,
    });
    console.log(
      response.success ? '여행 루트 조회 성공:' : '여행 루트 조회 실패:',
      response.message
    );
    return response;
  } catch (error: any) {
    return handleApiError(error, '서버 내부 오류가 발생하였습니다.');
  }
};
