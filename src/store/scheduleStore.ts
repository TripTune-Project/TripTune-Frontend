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
  // 여행 루트 변경 이벤트(ROUTE_ADDED·UPDATED·DELETED) 수신 시 필요할 때만 재조회
  onRouteEvent: (scheduleId: number, routeVersion: number) => Promise<void>;
  addRoute: (scheduleId: number, placeId: number) => Promise<void>;
  deleteRoute: (scheduleId: number, routeId: number) => Promise<void>;
  // 여행지 탭의 [-]: 해당 장소의 루트를 모두 삭제
  deletePlaceRoutes: (scheduleId: number, placeId: number) => Promise<void>;
  // 드래그 중 로컬 순서만 바꾼다 (서버 반영은 놓는 순간 saveRouteOrder)
  onMovePlace: (dragIndex: number, hoverIndex: number) => void;
  saveRouteOrder: (scheduleId: number) => Promise<void>;

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
  // 응답을 기다리는 내 여행 루트 요청 수 (화면 갱신이 필요 없어 상태에 두지 않는다)
  let pendingRouteRequests = 0;

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
    pendingRouteRequests++;
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
    } finally {
      // 재조회 전에 내린다: 재조회 중 온 다른 참석자 이벤트는 version 비교로 처리
      pendingRouteRequests--;
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

        // 동시에 나간 조회 중 먼저 보낸 것이 늦게 도착하면 예전 루트·version이라 버린다
        // (덮어쓰면 화면이 되돌아가고 다음 수정이 409가 된다)
        if (
          routeVersion !== undefined &&
          routeVersion < (get().routeVersion ?? -1)
        )
          return;

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

    // 이미 반영된 version이면 무시. 내 요청이 응답 전이면 응답 후 어차피 재조회하므로 건너뛴다
    // (이벤트가 HTTP 응답보다 먼저 와도 재조회가 1번으로 끝난다)
    onRouteEvent: async (scheduleId: number, routeVersion: number) => {
      if (pendingRouteRequests > 0) return;
      if (routeVersion <= (get().routeVersion ?? -1)) return;
      await get().loadRoutes(scheduleId);
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

    saveRouteOrder: (scheduleId: number) =>
      runRouteRequest(scheduleId, (routeVersion) =>
        updateTravelRouteOrder(
          scheduleId,
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
