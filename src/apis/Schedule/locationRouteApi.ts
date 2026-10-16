import { get, patch, post, remove } from '../api';
import {
  ApiResponse,
  RouteList,
  RouteVersion,
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

// 여행 루트 추가 (POST) - 마지막 순서로 추가
export const addTravelRoute = async (
  scheduleId: number,
  routeVersion: number,
  placeId: number
): Promise<ApiResponse<RouteVersion>> => {
  const url = `/api/schedules/${scheduleId}/routes`;
  return await post(url, { routeVersion, placeId }, { requiresAuth: true });
};

// 여행 루트 순서 수정 (PATCH) - 전체 순서를 routeId 배열로 전달
export const updateTravelRouteOrder = async (
  scheduleId: number,
  routeId: number,
  routeVersion: number,
  orderedRouteIds: number[]
): Promise<ApiResponse<RouteVersion>> => {
  const url = `/api/schedules/${scheduleId}/routes/${routeId}`;
  return await patch(
    url,
    { routeVersion, orderedRouteIds },
    { requiresAuth: true }
  );
};

// 여행 루트 삭제 (DELETE)
export const deleteTravelRoute = async (
  scheduleId: number,
  routeId: number,
  routeVersion: number
): Promise<ApiResponse<RouteVersion>> => {
  const url = `/api/schedules/${scheduleId}/routes/${routeId}?routeVersion=${routeVersion}`;
  return await remove(url, undefined, { requiresAuth: true });
};
