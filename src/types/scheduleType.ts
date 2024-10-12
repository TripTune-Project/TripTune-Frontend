export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: number;
}

// 일정 정보
export interface Schedule {
  scheduleId?: number;
  scheduleName: string;
  startDate: string;
  endDate: string;
}

export interface Attendee {
  attendeeId: number;
  userId: string;
  role: string;
  permission: string;
}

// 장소 정보
export interface Place {
  latitude?: number;
  longitude?: number;
  placeId: number;
  country: string;
  city: string;
  district: string;
  address: string;
  detailAddress: string;
  placeName: string;
  thumbnailUrl: string;
  isBookmarked?: boolean;
}

// 페이지 내이션 + 장소 리스트
export interface PaginatedPlaces {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  content: Place[];
}

// 전반적인 상세 정보
export interface ScheduleDetail {
  // TODO : 이상한 점 발견
  travelRoute?: string;
  attendees?: string;
  //
  scheduleId?: string;
  scheduleName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  attendeeList: Attendee[];
  placeList: PaginatedPlaces;
}

export interface TravelRoute {
  routeId: number;
  destination: string;
  startTime: string;
  endTime: string;
}
