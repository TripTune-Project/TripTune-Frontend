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
  });
};
