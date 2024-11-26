import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchScheduleList,
  fetchScheduleListSearch,
  fetchSharedScheduleList,
} from '@/api/scheduleApi';
import {
  fetchTravelList,
  fetchTravelRoute,
  searchTravelDestinations,
} from '@/api/locationRouteApi';

// 일정 목록 조회 (GET)
export const useScheduleList = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['scheduleAllList'],
    queryFn: ({ pageParam }) => fetchScheduleList(pageParam || 1),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.data?.currentPage ?? 0;
      const totalPages = lastPage?.data?.totalPages ?? 0;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });
};

// 공유된 일정 목록 조회 (GET)
export const useSharedScheduleList = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['sharedScheduleList'],
    queryFn: ({ pageParam }) => fetchSharedScheduleList(pageParam || 1),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.data?.currentPage ?? 0;
      const totalPages = lastPage?.data?.totalPages ?? 0;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });
};

// 일정 목록 중 검색 (GET)
export const useScheduleListSearch = (
  keyword: string,
  type: 'all' | 'share' = 'all',
  enabled = true,
  page = 1
) => {
  return useInfiniteQuery({
    queryKey: ['scheduleListSearch', keyword, type],
    queryFn: ({ pageParam }) =>
      fetchScheduleListSearch(pageParam || page, keyword, type),
    enabled: !!keyword && enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.data?.currentPage ?? 0;
      const totalPages = lastPage?.data?.totalPages ?? 0;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });
};

// 여행지 조회 (GET)
export const useScheduleTravelList = (
  scheduleId: number,
  page = 1,
  enabled = true
) => {
  return useQuery({
    queryKey: ['scheduleTravelList', scheduleId, page],
    queryFn: () => fetchTravelList(scheduleId, page),
    enabled,
  });
};

// 여행지 검색 (GET)
export const useTravelListByLocation = (
  scheduleId: number,
  keyword: string,
  page = 1,
  enabled = true
) => {
  return useQuery({
    queryKey: ['travelListByLocation', scheduleId, keyword, page],
    queryFn: () => searchTravelDestinations(scheduleId, page, keyword),
    enabled,
  });
};

// TODO : 여행 루트 조회 무한스크롤 진행 예정
// 여행 루트 조회 (GET)
export const useScheduleTravelRoute = (
  scheduleId: number,
  page = 1,
  enabled = true
) => {
  return useInfiniteQuery({
    queryKey: ['scheduleTravelRouteList', scheduleId, page],
    queryFn: () => fetchTravelRoute(scheduleId, page),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.data?.currentPage ?? 0;
      const totalPages = lastPage?.data?.totalPages ?? 0;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });
};
