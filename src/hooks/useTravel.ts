import { useQuery } from '@tanstack/react-query';
import {
  fetchTravelListByLocation,
  fetchTravelListSearch,
  fetchTravelDetail,
} from '@/api/travelApi';
import { Coordinates } from '@/types';
import { TravelListSearchParams } from '@/types/travelType';

export const useTravelListByLocation = (
  params: Coordinates,
  page: number = 1,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['travelList', params, page],
    queryFn: () => fetchTravelListByLocation(params, page),
    enabled,
  });
};

export const useTravelListSearch = (
  params: TravelListSearchParams,
  page: number = 1,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['travelListSearch', params, page],
    queryFn: () => fetchTravelListSearch(params, page),
    enabled,
  });
};

export const useTravelDetail = (placeId: number) => {
  return useQuery({
    queryKey: ['travelDetail', placeId],
    queryFn: () => fetchTravelDetail(placeId),
  });
};
