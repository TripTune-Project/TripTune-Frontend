import { get, post, patch } from './api';
import { ApiResponse } from '@/types/travelType';
import { Schedule, ScheduleDetails, TravelRoute } from '@/types/scheduleType';

// 일정 생성 (POST)
export const createSchedule = async (scheduleData: Schedule): Promise<ApiResponse<Schedule>> => {
  const url = '/schedules';
  
  try {
    const response = await post<ApiResponse<Schedule>>(url, scheduleData, { requiresAuth: true });
    if (response.success) {
      console.log('일정 생성 성공:', response);
    } else {
      console.error('일정 생성 실패:', response.message);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

// 일정 조회 (GET)
export const getSchedule = async (scheduleId: number, page: number = 1): Promise<ApiResponse<Schedule>> => {
  const url = `/schedules/${scheduleId}?page=${page}`;
  
  try {
    const response = await get<ApiResponse<Schedule>>(url, { requiresAuth: true });
    if (response.success) {
      console.log('일정 조회 성공:', response);
    } else {
      console.error('일정 조회 실패:', response.message);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

// 여행 경로 조회 (GET)
export const getTravels = async (scheduleId: number, page = 1): Promise<ApiResponse<TravelRoute[]>> => {
  const url = `/schedules/${scheduleId}/travels?page=${page}`;
  
  try {
    const response = await get<ApiResponse<TravelRoute[]>>(url, { requiresAuth: true });
    if (response.success) {
      console.log('여행 경로 조회 성공:', response.data);
    } else {
      console.error('여행 경로 조회 실패:', response.message);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

// 일정 검색 (POST)
export const searchSchedule = async (keyword: string): Promise<ApiResponse<{ searchList: Schedule[] }>> => {
  try {
    const response = await post<ApiResponse<{ searchList: Schedule[] }>>(
      '/schedule/search',
      { keyword },
      { requiresAuth: true },
    );
    
    if (response.success && response.data) {
      console.log('일정 검색 성공:', response.data.searchList);
    } else {
      console.error('일정 검색 실패:', response.message);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

// 상세 일정 생성 (POST)
export const createScheduleWithDetails = async (schedule: ScheduleDetails): Promise<ApiResponse<null>> => {
  const url = `/schedules/${schedule.scheduleId}`;
  
  try {
    const response = await post<ApiResponse<null>>(url, {
      scheduleName: schedule.scheduleName,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      attendees: schedule.attendees,
      travelRoute: schedule.travelRoute,
    }, { requiresAuth: true });
    
    if (response.success) {
      console.log('상세 일정 생성 성공:', response.message);
    } else {
      console.error('상세 일정 생성 실패:', response.message);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

// 일정 수정 (PATCH)
export const updateSchedule = async (schedule: ScheduleDetails): Promise<ApiResponse<null>> => {
  const url = `/schedules/${schedule.scheduleId}`;
  
  try {
    const response = await patch<ApiResponse<null>>(url, {
      scheduleName: schedule.scheduleName,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      attendees: schedule.attendees,
      travelRoute: schedule.travelRoute,
    }, { requiresAuth: true });
    
    if (response.success) {
      console.log('일정 수정 성공:', response.message);
    } else {
      console.error('일정 수정 실패:', response.message);
    }
    return response;
  } catch (error) {
    throw error;
  }
};
