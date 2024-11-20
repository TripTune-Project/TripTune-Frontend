// API 응답 제네릭 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: number;
}

// 일정 정보 생성
export interface ScheduleType {
  scheduleId?: number;
  scheduleName: string;
  startDate: string;
  endDate: string;
}

// 참여자 정보
export interface Attendee {
  attendeeId: number;
  userId?: string;
  nickname: string;
  role: string;
  permission: string;
  name: string;
  ImageSrc?: string;
  email?: string;
}

// 최근 일정 리스트
export interface ScheduleAllListType {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  totalSharedElements: number;
  pageSize: number;
  content: Place[];
}

// 일정 만들기 기본 조회
export interface ScheduleDetailType {
  scheduleId?: number;
  travelRoute?:unknown;
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
  scheduleId?: number;
  scheduleName?: string;
  startDate?: string;
  endDate?: string;
  sinceUpdate?: string;
  author?: { profileUrl: string; userId: string };
  role?: string;
}

// 여행지 조회, 여행지 검색, 여행루트 , 여행 일정
export interface ScheduleTravelResultType {
  placeId?: number;
  content: Place[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

// 채팅 정보
export interface ChatMessageType {
  messageId: string;
  timestamp: string;
  message: string;
}

export interface ChatUserType {
  nickname: string;
  profileImage: string;
  messages: ChatMessageType[];
}
