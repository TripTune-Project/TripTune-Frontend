import { get, post, patch } from './api';
import {
  ApiResponse,
  Schedule,
  ScheduleDetailType,
  ScheduleTravelResultType,
} from '@/types/scheduleType';

// 1.1 일정 "최근" 목록 조회 (GET)
export const fetchScheduleList = async (): Promise<ApiResponse<unknown>> => {
  const url = `/schedules`;
  
  try {
    const data = await get<ApiResponse<unknown>>(url, { requiresAuth: true });
    if (data.success) {
      console.log('일정 목록 조회 성공:', data);
    } else {
      console.error('일정 목록 조회 실패:', data.message);
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

// 1.2 일정 상세 조회 (GET)
export const fetchScheduleDetail = async (scheduleId: number, page: number = 1): Promise<ApiResponse<ScheduleDetailType>> => {
  const url = `/schedules/${scheduleId}?page=${page}`;
  
  try {
    const data = await get<ApiResponse<ScheduleDetailType>>(url, { requiresAuth: true });
    if (data.success) {
      console.log('일정 조회 성공:', data);
    } else {
      console.error('일정 조회 실패:', data.message);
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

// 1.3 일정 만들기 생성 (POST)
export const createNewSchedule = async (scheduleData: Schedule): Promise<ApiResponse<Schedule>> => {
  const url = '/schedules';
  
  try {
    const data = await post<ApiResponse<Schedule>>(url, scheduleData, { requiresAuth: true });
    if (data.success) {
      console.log('일정 생성 성공:', data);
    } else {
      console.error('일정 생성 실패:', data.message);
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

// 1.4 일정 만들기 수정/ 저장 (PATCH)
export const updateExistingSchedule = async (schedule: ScheduleDetailType): Promise<ApiResponse<ScheduleDetailType>> => {
  const url = `/schedules/${schedule.scheduleId}`;
  
  try {
    const data = await patch<ApiResponse<ScheduleDetailType>>(url, {
      scheduleName: schedule.scheduleName,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      // attendees: schedule.attendees,
      // travelRoute: schedule.travelRoute,
    }, { requiresAuth: true });
    
    if (data.success) {
      console.log('일정 수정 성공:', data.message);
    } else {
      console.error('일정 수정 실패:', data.message);
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

// 2.1 여행지 조회 (GET)
export const fetchTravelList = async (scheduleId: number, page = 1): Promise<ApiResponse<ScheduleTravelResultType>> => {
  const url = `/schedules/${scheduleId}/travels?page=${page}`;
  
  try {
    const data = await get<ApiResponse<ScheduleTravelResultType>>(url, { requiresAuth: true });
    if (data.success) {
      console.log('여행지 조회 성공:', data.data);
    } else {
      console.error('여행지 조회 실패:', data.message);
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

// 2.2 여행지 검색 (GET)
export const searchTravelDestinations = async (scheduleId: number, page = 1, keyword: string): Promise<ApiResponse<ScheduleTravelResultType>> => {
  const url = `/schedules/${scheduleId}/travels/search?page=${page}&keyword=${keyword}`;
  
  try {
    const data = await get<ApiResponse<ScheduleTravelResultType>>(url, { requiresAuth: true });
    if (data.success) {
      console.log('여행지 검색 성공:', data.data);
    } else {
      console.error('여행지 검색 실패:', data.message);
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

// 3.1 여행 루트 추가 (POST) 안할 수도 있음
export const addTravelRoute = async (scheduleId: number): Promise<ApiResponse<ScheduleTravelResultType>> => {
  const url = `/schedules/${scheduleId}/routes`;
  
  try {
    const data = await post<ApiResponse<ScheduleTravelResultType>>(url, { requiresAuth: true });
    if (data.success) {
      console.log('여행지 루트 추가 성공:', data.data);
    } else {
      console.error('여행지 루트 추가 실패:', data.message);
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

// 3.2 여행 루트 조회 (GET)
export const fetchTravelRoute = async (scheduleId: number, page = 1): Promise<ApiResponse<ScheduleTravelResultType>> => {
  const url = `/schedules/${scheduleId}/routes?page=${page}`;
  
  try {
    const data = await get<ApiResponse<ScheduleTravelResultType>>(url, { requiresAuth: true });
    if (data.success) {
      console.log('여행지 루트 조회 성공:', data.data);
    } else {
      console.error('여행지 루트 조회 실패:', data.message);
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};
