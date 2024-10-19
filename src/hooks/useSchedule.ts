import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addTravelRoute,
  createNewSchedule,
  fetchScheduleDetail, fetchScheduleList,
  fetchTravelList,
  fetchTravelRoute,
  searchTravelDestinations, updateExistingSchedule,
} from '@/api/scheduleApi';

// 1.1 일정 "최근" 목록 조회 (GET)
export const useScheduleList = (
  enabled = true,
) => {
  return useQuery({
    queryKey: ['scheduleList'],
    queryFn: () => fetchScheduleList,
    enabled,
  });
};

// 1.2 일정 상세 조회 (GET)
export const useScheduleDetailList = (
  scheduleId: number,
  page = 1,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['scheduleDetailList', scheduleId, page],
    queryFn: () => fetchScheduleDetail(scheduleId, page),
    enabled,
  });
};

// 1.3 일정 만들기 생성 (POST)
export const useCreateNewSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNewSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleDetailList'] });
    },
  });
};

// 1.4 일정 만들기 수정/ 저장 (PATCH)
export const useUpdateExistingSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExistingSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleDetailList'] });
    },
  });
};

// 2.1 여행지 조회 (GET)
export const useScheduleTravelList = (
  scheduleId: number,
  page = 1,
  enabled = true,
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
  keyword:string,
  page = 1,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['travelListByLocation', scheduleId, keyword, page],
    queryFn: () => searchTravelDestinations(scheduleId, page, keyword),
    enabled,
  });
};

// 3.1 여행 루트 추가 (POST) 안할 수도 있음
export const useAddTravelRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTravelRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleTravelRouteList'] });
    },
  });
};

// 3.2 여행 루트 조회 (GET)
export const useScheduleTravelRoute = (
  scheduleId: number,
  page = 1,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['scheduleTravelRouteList', scheduleId, page],
    queryFn: () => fetchTravelRoute(scheduleId, page),
    enabled,
  });
};
