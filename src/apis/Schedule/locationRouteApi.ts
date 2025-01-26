import { get } from '../api';
import {
  ApiResponse,
  RouteList,
  ScheduleTravelList,
} from '@/types/scheduleType';

// 여행지 조회 (GET)
export const fetchTravelList = async (
  scheduleId: number,
  page = 1
): Promise<ApiResponse<ScheduleTravelList>> => {
  const url = `/api/schedules/${scheduleId}/travels?page=${page}`;
  return await get<ApiResponse<ScheduleTravelList>>(url, {
    requiresAuth: true,
  });
};

// 여행지 검색 (GET)
export const searchTravelDestinations = async (
  scheduleId: number,
  page = 1,
  keyword: string
): Promise<ApiResponse<ScheduleTravelList>> => {
  const url = `/api/schedules/${scheduleId}/travels/search?page=${page}&keyword=${encodeURIComponent(keyword)}`;
  return await get<ApiResponse<ScheduleTravelList>>(url, {
    requiresAuth: true,
  });
};

// 여행 루트 조회 (GET)
export const fetchTravelRoute = async (
  scheduleId: number,
  page = 1
): Promise<ApiResponse<RouteList>> => {
  const url = `/api/schedules/${scheduleId}/routes?page=${page}`;
  return await get<ApiResponse<RouteList>>(url, {
    requiresAuth: true,
  });
};
