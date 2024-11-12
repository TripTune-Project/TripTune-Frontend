import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createNewSchedule,
  fetchScheduleList,
  updateExistingSchedule,
  deleteSchedule,
  fetchScheduleListSearch,
  fetchSharedScheduleList,
} from '@/api/scheduleApi';
import {
  fetchTravelList,
  fetchTravelRoute,
  searchTravelDestinations,
} from '@/api/locationRouteApi';
import { leaveSchedule, shareSchedule } from '@/api/attendeeApi';

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

// 일정 만들기 생성 (POST)
export const useCreateNewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleAllList'] });
    },
  });
};

// 일정 만들기 수정 / 저장 (PATCH)
export const useUpdateExistingSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExistingSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleDetailList'] });
    },
  });
};

// 일정 삭제 (DELETE)
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleAllList'] });
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

// 여행 루트 조회 (GET)
export const useScheduleTravelRoute = (
  scheduleId: number,
  page = 1,
  enabled = true
) => {
  return useQuery({
    queryKey: ['scheduleTravelRouteList', scheduleId, page],
    queryFn: () => fetchTravelRoute(scheduleId, page),
    enabled,
  });
};

// 일정 참석자 관련 - 일정 공유하기 (POST)
export const useShareSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      scheduleId,
      userId,
      permission,
    }: {
      scheduleId: number;
      userId: string;
      permission: 'ALL' | 'EDIT' | 'CHAT' | 'READ';
    }) => shareSchedule(scheduleId, userId, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleDetailList'] });
    },
  });
};

// 일정 참석자 관련 - 일정 나가기 (DELETE)
export const useLeaveSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId: number) => leaveSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleAllList'] });
    },
  });
};
