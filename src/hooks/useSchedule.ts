import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchScheduleList,
  fetchScheduleListSearch,
  fetchSchedulesPreview,
  fetchSharedScheduleList,
} from '@/apis/Schedule/scheduleApi';
import {
  fetchTravelList,
  searchTravelDestinations,
} from '@/apis/Schedule/locationRouteApi';

// 일정 목록 조회 (GET)
export const useScheduleList = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['scheduleAllList'],
    queryFn: ({ pageParam }) => fetchScheduleList(pageParam || 1),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data) return undefined;
      const { currentPage, totalPages } = lastPage.data;
      return currentPage < totalPages ? currentPage + 1 : undefined;
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
      if (!lastPage?.data) return undefined;
      const { currentPage, totalPages } = lastPage.data;
      return currentPage < totalPages ? currentPage + 1 : undefined;
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
      if (!lastPage?.data) return undefined;
      const { currentPage, totalPages } = lastPage.data;
      return currentPage < totalPages ? currentPage + 1 : undefined;
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

// 내 일정 목록 조회 (모달창)
export const useMyScheduleList = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['myScheduleList'],
    queryFn: ({ pageParam }) => fetchSchedulesPreview(pageParam || 1),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data) return undefined;
      const { currentPage, totalPages } = lastPage.data;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};
