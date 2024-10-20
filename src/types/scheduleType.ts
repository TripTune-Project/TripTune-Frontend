// API 응답 제네릭 타입
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

// 참여자 정보
export interface Attendee {
  attendeeId: number;
  userId: string;
  role: string;
  permission: string;
}

// 일정 만들기 기본 조회
export interface ScheduleDetailType {
  scheduleId?: number;
  attendeeList: Attendee;
  createdAt: string;
  endDate: string;
  placeList: Place;
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  scheduleName: string;
  startDate: string;
  updatedAt?: string;
}

// 장소 정보
export interface Place {
  routeOrder?: number;
  latitude: number;
  longitude: number;
  placeId: number;
  country: string;
  city: string;
  district: string;
  address: string;
  detailAddress?: string;
  placeName: string;
  thumbnailUrl: string;
}

// 여행지 조회, 여행지 검색, 여행루트
export interface ScheduleTravelResultType {
  placeId?:number;
  content: Place[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
