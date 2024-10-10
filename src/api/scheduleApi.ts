import { authGet, authPatch, authPost } from '@/api/authFetch';

interface Schedule {
  scheduleId?: number;
  scheduleName: string;
  startDate: string;
  endDate: string;
}

interface Attendee {
  name: string;
  email: string;
}

interface TravelRoute {
  routeId: number;
  destination: string;
  startTime: string;
  endTime: string;
}

interface ScheduleDetails extends Schedule {
  attendees: Attendee[];
  travelRoute: TravelRoute[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

// 공통 오류 처리 함수
const handleApiError = (error: unknown, defaultMessage: string): void => {
  const message = error instanceof Error ? error.message : defaultMessage;
  console.error(message);
  alert(message);
};

// 일정 생성 (POST)
export const createSchedule = async (scheduleData: Schedule): Promise<void> => {
  const url = '/api/schedules';
  
  try {
    const response = await authPost<ApiResponse<Schedule>>(url, scheduleData);
    if (response.success) {
      console.log('일정 작성 성공:', response);
    } else {
      console.error('일정 작성 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error, '일정 작성 실패');
  }
};

// 일정 조회 (GET)
export const getSchedule = async (scheduleId: number, page = 1): Promise<void> => {
  const url = `/api/schedules/${scheduleId}?page=${page}`;
  
  try {
    const response = await authGet<ApiResponse<Schedule>>(url);
    if (response.success) {
      console.log('일정 조회 성공:', response.data);
    } else {
      console.error('일정 조회 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error, '일정 조회 실패');
  }
};

// 여행지 조회 (GET)
export const getTravels = async (scheduleId: number, page = 1): Promise<void> => {
  const url = `/api/schedules/${scheduleId}/travels?page=${page}`;
  
  try {
    const response = await authGet<ApiResponse<TravelRoute[]>>(url);
    if (response.success) {
      console.log('여행지 조회 성공:', response.data);
    } else {
      console.error('여행지 조회 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error, '여행지 조회 실패');
  }
};

// 일정 검색 (POST)
export const searchSchedule = async (keyword: string): Promise<Schedule[] | undefined> => {
  try {
    const response = await authPost<ApiResponse<{ searchList: Schedule[] }>>(
      '/schedule/search',
      { keyword }
    );
    
    if (response.success && response.data) {
      console.log('검색 성공:', response.data.searchList);
      return response.data.searchList;
    } else {
      console.error('검색 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error, '일정 검색 실패');
  }
};

// 일정 작성 - 상세 내용 포함 (POST)
export const createScheduleWithDetails = async (schedule: ScheduleDetails): Promise<void> => {
  const url = `/schedules/${schedule.scheduleId}`;
  
  try {
    const response = await authPost<ApiResponse<null>>(url, {
      scheduleName: schedule.scheduleName,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      attendees: schedule.attendees,
      travelRoute: schedule.travelRoute,
    });
    
    if (response.success) {
      console.log('일정 작성 성공:', response.message);
    } else {
      console.error('일정 작성 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error, '일정 작성 실패');
  }
};

// 일정 수정 (PATCH)
export const updateSchedule = async (schedule: ScheduleDetails): Promise<void> => {
  const url = `/schedules/${schedule.scheduleId}`;
  
  try {
    const response = await authPatch<ApiResponse<null>>(url, {
      scheduleName: schedule.scheduleName,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      attendees: schedule.attendees,
      travelRoute: schedule.travelRoute,
    });
    
    if (response.success) {
      console.log('일정 수정 성공:', response.message);
    } else {
      console.error('일정 수정 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error, '일정 수정 실패');
  }
};
