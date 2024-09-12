import { useQuery } from '@tanstack/react-query';
import { fetchTravelListByLocation, fetchTravelListSearch, fetchTravelDetail } from '@/api/travelApi';

export const useTravelListByLocation = (params, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ['travelList', params, page],
    queryFn: () => fetchTravelListByLocation(params, page),
    enabled,
  });
};

export const useTravelListSearch = (params, page = 1, enabled = false) => {
  return useQuery({
    queryKey: ['travelListSearch', params, page],
    queryFn: () => fetchTravelListSearch(params, page),
    enabled,
  });
};

export const useTravelDetail = (placeId) => {
  return useQuery({
    queryKey: ['travelDetail', placeId],
    queryFn: () => fetchTravelDetail(placeId)
  });
};
