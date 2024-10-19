export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: number;
}

// 일정 정보 생성
export interface Schedule {
  scheduleId?: number;
  scheduleName: string;
  startDate: string;
  endDate: string;
}

// 참여자
export interface Attendee {
  attendeeId: number;
  userId: string;
  role: string;
  permission: string;
}

// 장소 정보
export interface Place {
  routeOrder?:number;
  latitude: number;
  longitude: number;
  placeId: number;
  country: string;
  city: string;
  district: string;
  address: string;
  detailAddress: string;
  placeName: string;
  thumbnailUrl: string;
}

// 전반적인 스케줄의 상세 정보
export interface ScheduleDetail {
  scheduleId?: number;
  scheduleName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  attendeeList: Attendee[];
  placeList: PaginatedPlaces;
}

// 페이지 내이션 + 장소 리스트
export interface PaginatedPlaces {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  content: Place[];
}
