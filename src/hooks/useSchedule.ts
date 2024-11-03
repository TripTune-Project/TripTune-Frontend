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
  fetchScheduleListSearch, fetchSharedScheduleList,
} from '@/api/scheduleApi';

// 일정 만들기 - 일정
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

// 공유 일정 목록 조회 (GET)
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

// 일정 상세 조회 (GET)
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

// 일정 만들기 생성 (POST)
export const useCreateNewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleDetailList'] });
    },
  });
};

// 일정 만들기 수정/ 저장 (PATCH)
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
// TODO : 일정 작성자만 가능한지 확인 필수
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleAllList'] });
    },
  });
};

// 일정 만들기 - 여행지 탭  , 여행 루트 탭
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

// 일정 만들기 - 참석자 관련
// 일정 나가기
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
