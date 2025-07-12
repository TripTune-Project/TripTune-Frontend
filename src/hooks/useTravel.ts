import { Coordinates } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {
  fetchTravelListByLocation,
  fetchTravelListSearch,
} from '@/apis/Travel/travelApi';
import { TravelListSearchParams } from '@/types/travelType';

export const useTravelListByLocation = (
  params: Coordinates,
  page: number = 1,
  requiresAuth: boolean,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['travelList', params, page, requiresAuth],
    queryFn: () => fetchTravelListByLocation(params, page, requiresAuth),
    enabled,
    // 인증 상태 변경 시 데이터 신선도 유지
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

export const useTravelListSearch = (
  params: TravelListSearchParams,
  page: number = 1,
  requiresAuth: boolean,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['travelListSearch', params, page, requiresAuth],
    queryFn: () => fetchTravelListSearch(params, page, requiresAuth), // requiresAuth 전달
    enabled,
    // 인증 상태 변경 시 데이터 신선도 유지
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};
