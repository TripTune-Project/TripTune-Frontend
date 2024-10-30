import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createNewSchedule,
  fetchScheduleDetail,
  fetchScheduleList,
  fetchTravelList,
  fetchTravelRoute,
  searchTravelDestinations,
  updateExistingSchedule,
  updateScheduleAttendees,
  deleteSchedule,
  fetchScheduleListSearch,
} from '@/api/scheduleApi';

// 1.1 일정 "최근" 목록 조회 (GET)
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

// 1.2 일정 목록 중 검색 (GET)
export const useScheduleListSearch = (
  keyword: string,
  enabled = true,
  page = 1
) => {
  return useInfiniteQuery({
    queryKey: ['scheduleListSearch', keyword],
    queryFn: ({ pageParam }) =>
      fetchScheduleListSearch(pageParam || page, keyword),
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

// 1.3 일정 상세 조회 (GET)
export const useScheduleDetailList = (
  scheduleId: number,
  page = 1,
  enabled = true
) => {
  return useQuery({
    queryKey: ['scheduleDetailList', scheduleId, page],
    queryFn: () => fetchScheduleDetail(scheduleId, page),
    enabled,
  });
};

// 1.4 일정 만들기 생성 (POST)
export const useCreateNewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleDetailList'] });
    },
  });
};

// 1.5 일정 만들기 수정/ 저장 (PATCH)
export const useUpdateExistingSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExistingSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleDetailList'] });
    },
  });
};

// 1.6 일정 삭제 (DELETE)
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleAllList'] });
    },
  });
};

// 1.7 일정 참석자 추가/수정 (PATCH)
export const useUpdateScheduleAttendees = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      scheduleId,
      attendeeList,
    }: {
      scheduleId: number;
      attendeeList: { userId: string; role: string; permission: string }[];
    }) => updateScheduleAttendees(scheduleId, attendeeList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleDetailList'] });
    },
  });
};

// 2.1 여행지 조회 (GET)
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

// 2.2 여행지 검색 (GET)
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

// 3.1 여행 루트 조회 (GET)
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
