import { create } from 'zustand';
import { fetchScheduleDetail } from '@/apis/Schedule/scheduleApi';
import {
  Route,
  RouteVersion,
  Schedule,
  ApiResponse,
} from '@/types/scheduleType';
import {
  addTravelRoute,
  deleteTravelRoute,
  fetchTravelRoute,
  updateTravelRouteOrder,
} from '@/apis/Schedule/locationRouteApi';

// 마커 정보를 나타내는 인터페이스
interface Makers {
  placeId: number; // 장소 ID
  lat: number; // 위도
  lng: number; // 경도
}

// 여행 관련 상태와 동작을 관리하는 인터페이스
interface TravelStore {
  addedPlaces: Makers[]; // 지도 마커 (여행 루트에서 만든다)
  travelRoute: Route[]; // 서버에 저장된 여행 루트 (드래그 중에만 로컬 순서가 다를 수 있음)
  routeVersion?: number; // 여행 루트 동시 수정 확인용
  scheduleDetail: Schedule; // 일정 상세 정보
  canEdit: boolean; // 현재 사용자의 편집 권한 여부
  editDeniedAt: number; // 편집 권한 없이 편집을 시도한 시각 (알림 트리거용)
  routeError: { message: string; at: number } | null; // 여행 루트 요청 실패 (알림 트리거용)

  setCanEdit: (canEdit: boolean) => void;

  // 여행 루트: 클릭 이벤트마다 서버에 반영하고, 끝나면 서버 루트를 다시 불러온다
  loadRoutes: (scheduleId: number) => Promise<void>;
  addRoute: (scheduleId: number, placeId: number) => Promise<void>;
  deleteRoute: (scheduleId: number, routeId: number) => Promise<void>;
  // 여행지 탭의 [-]: 해당 장소의 루트를 모두 삭제
  deletePlaceRoutes: (scheduleId: number, placeId: number) => Promise<void>;
  // 드래그 중 로컬 순서만 바꾼다 (서버 반영은 놓는 순간 saveRouteOrder)
  onMovePlace: (dragIndex: number, hoverIndex: number) => void;
  saveRouteOrder: (scheduleId: number, routeId: number) => Promise<void>;

  // 일정 세부 정보 관리
  setScheduleDetail: (schedule: Schedule) => void;
  fetchScheduleDetailById: (scheduleId: string, page: number) => Promise<void>;
  updateScheduleDetail: (schedule: Schedule) => void;

  // 참석자 변경 이벤트 시각 (참석자·권한 재조회 트리거)
  attendeesUpdatedAt: number;
  notifyAttendeesUpdated: () => void;

  // 여행 루트 초기화
  resetTravelRoute: () => void;
}

// 편집 권한이 없으면 상태를 바꾸지 않고 거부 시각만 기록한다
const denyEdit = (state: TravelStore) =>
  state.canEdit ? null : { editDeniedAt: Date.now() };

// Zustand로 여행 상태 저장소 생성
export const useTravelStore = create<TravelStore>((set, get) => {
  /**
   * 여행 루트 변경 요청 공통 처리
   * - 편집 권한이 없으면 요청하지 않는다
   * - 성공하면 응답의 routeVersion을 바로 반영해, 내 요청으로 발행된 이벤트는 무시되게 한다
   * - 실패(409 버전 충돌 포함)하면 메시지를 남긴다
   * - 성공·실패 모두 서버 루트를 다시 불러온다 (새 routeId, 최신 순서 반영)
   */
  const runRouteRequest = async (
    scheduleId: number,
    request: (routeVersion: number) => Promise<ApiResponse<RouteVersion>>
  ) => {
    const denied = denyEdit(get());
    if (denied) {
      set(denied);
      return;
    }
    try {
      const response = await request(get().routeVersion ?? 0);
      if (response.success) {
        set({ routeVersion: response.data?.routeVersion });
      } else {
        set({
          routeError: {
            message: response.message || '여행 루트 수정에 실패했습니다.',
            at: Date.now(),
          },
        });
      }
    } catch (error) {
      set({
        routeError: {
          message:
            error instanceof Error
              ? error.message
              : '여행 루트 수정에 실패했습니다.',
          at: Date.now(),
        },
      });
    }
    await get().loadRoutes(scheduleId);
  };

  return {
    addedPlaces: [],
    travelRoute: [],
    routeVersion: undefined,
    scheduleDetail: {} as Schedule,
    canEdit: true,
    editDeniedAt: 0,
    routeError: null,
    attendeesUpdatedAt: 0,

    setCanEdit: (canEdit: boolean) => set({ canEdit }),

    notifyAttendeesUpdated: () => set({ attendeesUpdatedAt: Date.now() }),

    // 여행 루트 전체 조회 (화면에는 ScheduleRoute가 5개씩 나눠 보여준다)
    loadRoutes: async (scheduleId: number) => {
      try {
        let currentPage = 1;
        let totalPages = 1;
        let routeVersion: number | undefined;
        let allRoutes: Route[] = [];

        while (currentPage <= totalPages) {
          const response = await fetchTravelRoute(scheduleId, currentPage);
          if (!response.success) {
            console.error(
              `[여행 경로 가져오기] ${currentPage}페이지 조회 실패`
            );
            return;
          }
          totalPages = response.data.totalPages;
          routeVersion = response.data.routeVersion;
          // 같은 장소가 두 번 있을 수 있으므로(내 일정 담기) placeId로 거르지 않는다
          allRoutes = [...allRoutes, ...response.data.content];
          currentPage++;
        }

        allRoutes.sort((a, b) => a.routeOrder - b.routeOrder);
        set({
          travelRoute: allRoutes,
          routeVersion,
          addedPlaces: allRoutes.map((route) => ({
            placeId: route.placeId,
            lat: route.latitude,
            lng: route.longitude,
          })),
        });
      } catch (error) {
        console.error('[여행 경로 가져오기] 오류 발생:', error);
      }
    },

    addRoute: (scheduleId: number, placeId: number) =>
      runRouteRequest(scheduleId, (routeVersion) =>
        addTravelRoute(scheduleId, routeVersion, placeId)
      ),

    deleteRoute: (scheduleId: number, routeId: number) =>
      runRouteRequest(scheduleId, (routeVersion) =>
        deleteTravelRoute(scheduleId, routeId, routeVersion)
      ),

    deletePlaceRoutes: async (scheduleId: number, placeId: number) => {
      const routeIds = get()
        .travelRoute.filter((route) => route.placeId === placeId)
        .map((route) => route.routeId);
      // ponytail: 한 건씩 순서대로 삭제 (매번 최신 routeVersion 사용). 같은 장소가 여러 번일 때만 요청이 늘어난다
      for (const routeId of routeIds) {
        await get().deleteRoute(scheduleId, routeId);
      }
    },

    onMovePlace: (dragIndex: number, hoverIndex: number) =>
      set((state) => {
        const denied = denyEdit(state);
        if (denied) return denied;
        const updatedRoute = [...state.travelRoute];
        const [movedItem] = updatedRoute.splice(dragIndex, 1);
        updatedRoute.splice(hoverIndex, 0, movedItem);
        return { travelRoute: updatedRoute };
      }),

    saveRouteOrder: (scheduleId: number, routeId: number) =>
      runRouteRequest(scheduleId, (routeVersion) =>
        updateTravelRouteOrder(
          scheduleId,
          routeId,
          routeVersion,
          get().travelRoute.map((route) => route.routeId)
        )
      ),

    // 일정 세부 정보를 설정
    setScheduleDetail: (schedule: Schedule) =>
      set({ scheduleDetail: schedule }),

    // 일정 세부 정보를 ID로 가져오기
    fetchScheduleDetailById: async (scheduleId: string, page: number) => {
      const response = await fetchScheduleDetail(Number(scheduleId), page);
      if (response.success) {
        set({ scheduleDetail: response.data });
      } else {
        if (response.message === '일정이 존재하지 않습니다.') {
          throw new Error('일정이 존재하지 않습니다.');
        }
        console.error(
          '일정 세부 정보를 가져오는데 실패했습니다:',
          response.message
        );
      }
    },

    // 일정 세부 정보를 업데이트
    updateScheduleDetail: (updates: Partial<Schedule>) =>
      set((state) => {
        const denied = denyEdit(state);
        if (denied) return denied;
        return {
          scheduleDetail: {
            ...state.scheduleDetail,
            ...updates,
          },
        };
      }),

    // 여행 루트 초기화
    resetTravelRoute: () =>
      set({
        addedPlaces: [],
        travelRoute: [],
        routeVersion: undefined,
        routeError: null,
        canEdit: true,
        attendeesUpdatedAt: 0,
      }),
  };
});
