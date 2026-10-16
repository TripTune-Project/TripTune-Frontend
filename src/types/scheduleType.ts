// 공통 응답 구조 : 제네릭 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: number;
}

// 페이지네이션 공통 구조
export interface Pagination {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
}

// 일정 정보
export interface Schedule {
  scheduleId?: number;
  scheduleVersion?: number; // 일정 동시 수정 확인용 (일정 상세조회 시에만 내려옴)
  role?: Role;
  scheduleName?: string;
  startDate?: string;
  endDate?: string;
  sinceUpdate?: string;
  thumbnailUrl?: string | null;
  author?: Author;
}

// 작성자 정보
export interface Author {
  nickname: string;
  profileUrl: string;
}

// 참석자 역할
export type Role = 'AUTHOR' | 'GUEST';

// 참석자 권한
export type Permission = 'ALL' | 'EDIT' | 'CHAT' | 'READ';

// 일정 목록 조회 응답
export interface ScheduleList extends Pagination {
  totalSharedElements: number;
  content: Schedule[];
}

// 일정 상세 조회 응답
export interface ScheduleDetail {
  scheduleId: number;
  scheduleVersion?: number;
  role?: Role;
  scheduleName: string;
  startDate: string;
  endDate: string;
  sinceUpdate?: string;
  createdAt?: string;
  updatedAt?: string;
  placeList?: PlaceList;
  travelRoute?: ScheduleTravelRoute[];
  thumbnailUrl?: string | null;
  author?: Author;
}

// 장소 목록
export interface PlaceList extends Pagination {
  content: Place[];
}

// 장소 정보
export interface Place {
  placeId: number;
  country: string;
  city: string;
  district: string;
  address: string;
  detailAddress?: string;
  longitude: number;
  latitude: number;
  placeName: string;
  thumbnailUrl: string | null | undefined;
  routeOrder?: number;
}

// 일정 생성 요청
export interface CreateSchedule {
  scheduleName: string;
  startDate: string;
  endDate: string;
}

// 일정 생성 응답
export interface CreateSchedule {
  scheduleId?: number;
}

// 일정 수정 요청
export interface UpdateSchedule {
  scheduleId: number;
  scheduleVersion?: number; // 요청: 상세조회로 받은 값 / 응답: 갱신된 값
  scheduleName: string;
  startDate: string;
  endDate: string;
}

// 여행 일정
export interface ScheduleTravelRoute {
  routeOrder: number;
  placeId: number;
}

// 여행지 조회 응답
export interface ScheduleTravelList extends Pagination {
  content: Place[];
}

// 여행지 검색 요청 파라미터
export interface SearchScheduleTravelParams {
  page: number;
  keyword?: string;
}

// 여행 루트 정보
export interface Route extends Place {
  routeId: number;
  routeOrder: number;
}

// 여행 루트 조회 응답
export interface RouteList extends Pagination {
  routeVersion: number; // 여행 루트 동시 수정 확인용
  content: Route[];
}

// 여행 루트 추가·수정·삭제 응답
export interface RouteVersion {
  routeVersion: number;
}

// 참석자 정보
export interface Attendee {
  attendeeId: number;
  nickname: string;
  permission: Permission;
  profileUrl: string;
  role: Role;
  email: string;
}

// 일정 공유 요청 파라미터
export interface ShareSchedule {
  email: string;
  permission: Permission;
}

// 일정 나가기 응답
export interface LeaveSchedule {
  success: boolean;
  message: string;
}

// 채팅 메시지
export interface ChatMessage {
  nickname: string;
  profileUrl: string;
  messageId: string;
  timestamp: string;
  message: string;
}

// 일정 이벤트 (/sub/schedules/{scheduleId}/events)
export type ScheduleEvent =
  | {
      eventType: 'ATTENDEE_ADDED';
      message: string;
      data: Attendee;
    }
  | {
      eventType: 'ATTENDEE_REMOVED' | 'ATTENDEE_LEFT';
      message: string;
      data: { attendeeId: number };
    }
  | {
      eventType: 'ATTENDEE_PERMISSION_UPDATED';
      message: string;
      data: { attendeeId: number; permission: Permission };
    }
  | {
      eventType: 'SCHEDULE_UPDATED';
      message: null;
      data: {
        scheduleVersion: number;
        scheduleName: string;
        startDate: string;
        endDate: string;
      };
    }
  | {
      eventType: 'ROUTE_ADDED' | 'ROUTE_UPDATED' | 'ROUTE_DELETED';
      message: null;
      data: { routeVersion: number };
    };

// 채팅 조회 응답
export interface ChatList extends Pagination {
  content: ChatMessage[];
}

// 채팅 보내기 요청
export interface SendMessage {
  scheduleId: number;
  nickname: string;
  message: string;
}

export interface SchedulePreviewResponse {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  content: SchedulePreviewItem[];
}

export interface SchedulePreviewItem {
  scheduleId: number;
  scheduleName: string;
  startDate: string;
  endDate: string;
  author: string;
}
