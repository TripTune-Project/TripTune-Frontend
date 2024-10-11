// 여행 루트 정보
export interface TravelRoute {
  routeId: number;
  destination: string;
  startTime: string;
  endTime: string;
}

// 일정 정보
export interface Schedule {
  scheduleId?: number;
  scheduleName: string;
  startDate: string;
  endDate: string;
}

// 참석자 정보
export interface Attendee {
  attendeeId: number;
  userId: string;
  role: string;
  permission: string;
  createdAt: string;
}

// 장소 정보
export interface Place {
  placeId: number;
  country: string;
  city: string;
  district: string;
}

// 장소 리스트 (페이지네이션 지원)
export interface PlaceList {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  content: Place[];
}

// 일정 상세 정보 (참석자 및 여행 루트 포함)
export interface ScheduleDetails extends Schedule {
  attendees: Attendee[];
  travelRoute: TravelRoute[];
}
