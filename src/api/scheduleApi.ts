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
const handleApiError = (error: Error, defaultMessage: string) => {
  const message = error?.message || defaultMessage;
  console.error(message);
  alert(message);
};

// 일정 만들기 (POST)
export const createSchedule = async (schedule: Schedule) => {
  try {
    const response = await authPost<ApiResponse<null>>('/schedules', {
      scheduleName: schedule.scheduleName,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
    });

    if (response.success) {
      console.log('일정 생성 성공:', response.message);
    } else {
      console.error('일정 생성 실패:', response.message);
    }

    return response;
  } catch (error) {
    handleApiError(error as Error, '일정 만들기 실패');
  }
};

// 일정 조회 (GET)
export const getSchedule = async (scheduleId: number) => {
  try {
    const response = await authGet<ApiResponse<ScheduleDetails>>(
      `/schedules/${scheduleId}`
    );

    if (response.success) {
      console.log('일정 조회 성공:', response.data);
      return response.data;
    } else {
      console.error('일정 조회 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error as Error, '일정 조회 실패');
  }
};

// 일정 검색 (POST)
export const searchSchedule = async (keyword: string) => {
  try {
    const response = await authPost<ApiResponse<{ searchList: Schedule[] }>>(
      '/schedule/search',
      {
        keyword,
      }
    );

    if (response.success) {
      console.log('검색 성공:', response.data?.searchList);
      return response.data?.searchList;
    } else {
      console.error('검색 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error as Error, '일정 검색 실패');
  }
};

// 일정 작성 - 상세 내용 포함 (POST)
export const createScheduleWithDetails = async (schedule: ScheduleDetails) => {
  try {
    const response = await authPost<ApiResponse<null>>(
      `/schedules/${schedule.scheduleId}`,
      {
        scheduleName: schedule.scheduleName,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        attendees: schedule.attendees,
        travelRoute: schedule.travelRoute,
      }
    );

    if (response.success) {
      console.log('일정 작성 성공:', response.message);
    } else {
      console.error('일정 작성 실패:', response.message);
    }

    return response;
  } catch (error) {
    handleApiError(error as Error, '일정 작성 실패');
  }
};

// 일정 수정 (PATCH)
export const updateSchedule = async (schedule: ScheduleDetails) => {
  try {
    const response = await authPatch<ApiResponse<null>>(
      `/schedules/${schedule.scheduleId}`,
      {
        scheduleName: schedule.scheduleName,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        attendees: schedule.attendees,
        travelRoute: schedule.travelRoute,
      }
    );

    if (response.success) {
      console.log('일정 수정 성공:', response.message);
    } else {
      console.error('일정 수정 실패:', response.message);
    }

    return response;
  } catch (error) {
    handleApiError(error as Error, '일정 수정 실패');
  }
};
