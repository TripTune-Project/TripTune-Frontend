import { get, post, patch } from './api';
import { ApiResponse, Schedule, ScheduleDetail } from '@/types/scheduleType';

// 1.1 일정 "최근" 목록 조회 (GET)
export const fetchScheduleList = async (): Promise<ApiResponse<Schedule>> => {
  const url = `/schedules`;
  
  try {
    const response = await get<ApiResponse<ScheduleDetail>>(url, { requiresAuth: true });
    if (response.success) {
      console.log('일정 목록 조회 성공:', response);
    } else {
      console.error('일정 목록 조회 실패:', response.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 1.2 일정 상세 조회 (GET)
export const fetchScheduleDetail = async (scheduleId: number, page: number = 1): Promise<ApiResponse<ScheduleDetail>> => {
  const url = `/schedules/${scheduleId}?page=${page}`;
  
  try {
    const response = await get<ApiResponse<ScheduleDetail>>(url, { requiresAuth: true });
    if (response.success) {
      console.log('일정 조회 성공:', response);
    } else {
      console.error('일정 조회 실패:', response.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 1.3 일정 만들기 생성 (POST)
export const createNewSchedule = async (scheduleData: Schedule): Promise<ApiResponse<Schedule>> => {
  const url = '/schedules';
  
  try {
    const response = await post<ApiResponse<Schedule>>(url, scheduleData, { requiresAuth: true });
    if (response.success) {
      console.log('일정 생성 성공:', response);
    } else {
      console.error('일정 생성 실패:', response.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 1.4 일정 만들기 수정/ 저장 (PATCH)
export const updateExistingSchedule = async (schedule: ScheduleDetail): Promise<ApiResponse<ScheduleDetail>> => {
  const url = `/schedules/${schedule.scheduleId}`;
  
  try {
    const response = await patch<ApiResponse<ScheduleDetail>>(url, {
      scheduleName: schedule.scheduleName,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      // attendees: schedule.attendees,
      // travelRoute: schedule.travelRoute,
    }, { requiresAuth: true });
    
    if (response.success) {
      console.log('일정 수정 성공:', response.message);
    } else {
      console.error('일정 수정 실패:', response.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2.1 여행지 조회 (GET)
export const fetchTravelList = async (scheduleId: number, page = 1): Promise<ApiResponse<unknown>> => {
  const url = `/schedules/${scheduleId}/travels?page=${page}`;
  
  try {
    const response = await get<ApiResponse<unknown>>(url, { requiresAuth: true });
    if (response.success) {
      console.log('여행지 조회 성공:', response.data);
    } else {
      console.error('여행지 조회 실패:', response.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2.2 여행지 검색 (GET)
export const searchTravelDestinations = async (scheduleId: number, page = 1, keyword: string): Promise<ApiResponse<unknown>> => {
  const url = `/schedules/${scheduleId}/travels/search?page=${page}&keyword=${keyword}`;
  
  try {
    const response = await get<ApiResponse<unknown>>(url, { requiresAuth: true });
    if (response.success) {
      console.log('여행지 검색 성공:', response.data);
    } else {
      console.error('여행지 검색 실패:', response.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3.1 여행 루트 추가 (POST)
export const addTravelRoute = async (scheduleId: number): Promise<ApiResponse<unknown>> => {
  const url = `/schedules/${scheduleId}/routes`;
  
  try {
    const response = await post<ApiResponse<unknown>>(url, { requiresAuth: true });
    if (response.success) {
      console.log('여행지 루트 추가 성공:', response.data);
    } else {
      console.error('여행지 루트 추가 실패:', response.message);
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// 3.2 여행 루트 조회 (GET)
export const fetchTravelRoute = async (scheduleId: number, page = 1): Promise<ApiResponse<ScheduleDetail>> => {
  const url = `/schedules/${scheduleId}/routes?page=${page}`;
  
  try {
    const response = await get<ApiResponse<ScheduleDetail>>(url, { requiresAuth: true });
    if (response.success) {
      console.log('여행지 루트 조회 성공:', response.data);
    } else {
      console.error('여행지 루트 조회 실패:', response.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
