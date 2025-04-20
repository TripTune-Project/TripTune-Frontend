import { create } from 'zustand';
import { fetchScheduleDetail } from '@/apis/Schedule/scheduleApi';
import { Place, Schedule } from '@/types/scheduleType';
import { fetchTravelRoute } from '@/apis/Schedule/locationRouteApi';

// 마커 정보를 나타내는 인터페이스
interface Makers {
  placeId: number; // 장소 ID
  lat: number; // 위도
  lng: number; // 경도
}

// 여행 관련 상태와 동작을 관리하는 인터페이스
interface TravelStore {
  addedPlaces: Makers[]; // 추가된 장소들의 리스트
  travelRoute: Place[]; // 여행 경로에 추가된 장소들의 리스트
  scheduleDetail: Schedule; // 일정 상세 정보
  deletedPlaces: number[]; // 삭제된 장소들의 ID 리스트

  // 장소 추가 및 제거
  addPlace: (place: Makers) => void;
  removePlace: (placeId: number) => void;

  // 경로에서 장소 이동
  onMovePlace: (dragIndex: number, hoverIndex: number) => void;

  // 경로에 장소 추가 및 제거
  addPlaceToRoute: (place: Place) => void;
  removePlaceFromRoute: (placeId: number) => void;

  // 일정 세부 정보 관리
  setScheduleDetail: (schedule: Schedule) => void;
  fetchScheduleDetailById: (scheduleId: string, page: number) => Promise<void>;
  updateScheduleDetail: (schedule: Schedule) => void;

  // 과거 데이터와 새로운 데이터를 병합
  fetchAndMergeRoutes: (scheduleId: number) => Promise<void>;
}

// Zustand로 여행 상태 저장소 생성
export const useTravelStore = create<TravelStore>((set) => ({
  addedPlaces: [], // 초기 추가된 장소 리스트
  travelRoute: [], // 초기 여행 경로 리스트
  scheduleDetail: {}, // 초기 일정 세부 정보
  deletedPlaces: [], // 삭제된 장소 ID 리스트

  // 장소 추가
  addPlace: (place: Makers) =>
    set((state) => {
      return state.addedPlaces.some((p) => p.placeId === place.placeId)
        ? state
        : { addedPlaces: [...state.addedPlaces, place] };
    }),

  // 장소 제거
  removePlace: (placeId: number) =>
    set((state) => {
      const updatedTravelRoute = state.travelRoute.filter(
        (place) => place.placeId !== placeId
      );
      const updatedAddedPlaces = state.addedPlaces.filter(
        (place) => place.placeId !== placeId
      );

      return {
        travelRoute: updatedTravelRoute,
        addedPlaces: updatedAddedPlaces,
        deletedPlaces: [...state.deletedPlaces, placeId], // 삭제된 장소 ID 추가
      };
    }),

  // 여행 경로에 장소 추가
  addPlaceToRoute: (place: Place) =>
    set((state) => {
      const updatedRoute = state.travelRoute.some(
        (p) => p.placeId === place.placeId
      )
        ? state.travelRoute
        : [...state.travelRoute, place];
      return { travelRoute: updatedRoute };
    }),

  // 여행 경로에서 장소 제거
  removePlaceFromRoute: (placeId: number) =>
    set((state) => {
      return {
        travelRoute: state.travelRoute.filter(
          (place) => place.placeId !== placeId
        ),
      };
    }),

  // 여행 경로에서 장소 이동 (드래그 앤 드롭)
  onMovePlace: (dragIndex: number, hoverIndex: number) =>
    set((state) => {
      const updatedRoute = [...state.travelRoute];
      const [movedItem] = updatedRoute.splice(dragIndex, 1);
      updatedRoute.splice(hoverIndex, 0, movedItem);
      return { travelRoute: updatedRoute };
    }),

  // 일정 세부 정보를 설정
  setScheduleDetail: (schedule: Schedule) =>
    set(() => {
      return { scheduleDetail: schedule };
    }),

  // 일정 세부 정보를 ID로 가져오기
  fetchScheduleDetailById: async (scheduleId: string, page: number) => {
    const response = await fetchScheduleDetail(Number(scheduleId), page);
    if (response.success) {
      set(() => {
        return { scheduleDetail: response.data };
      });
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
      return {
        scheduleDetail: {
          ...state.scheduleDetail,
          ...updates,
        },
      };
    }),

  // 과거 데이터와 새로운 데이터를 병합
  fetchAndMergeRoutes: async (scheduleId: number) => {
    try {
      let currentPage = 1;
      let totalPages = 1;
      let allRoutes: Place[] = [];

      // 모든 페이지의 데이터를 가져옴
      while (currentPage <= totalPages) {
        const response = await fetchTravelRoute(scheduleId, currentPage);

        if (response.success) {
          const { data } = response;
          totalPages = data.totalPages;
          // 여행 순서를 기준으로 정렬하여 추가
          allRoutes = [...allRoutes, ...data.content].sort(
            (a, b) => (a.routeOrder ?? 0) - (b.routeOrder ?? 0)
          );
          currentPage++;
        } else {
          console.error(`[여행 경로 가져오기] ${currentPage}페이지 조회 실패`);
          break;
        }
      }

      set((state) => {
        // 1. 현재 상태의 여행 경로에서 삭제되지 않은 항목들을 유지
        const currentRoutes = state.travelRoute.filter(
          (route) => !state.deletedPlaces.includes(route.placeId)
        );

        // 2. 서버에서 가져온 새로운 데이터 중 삭제되지 않고 현재 상태에 없는 항목들을 추가
        const newRoutes = allRoutes.filter(
          (newRoute) =>
            !state.deletedPlaces.includes(newRoute.placeId) &&
            !currentRoutes.some((route) => route.placeId === newRoute.placeId)
        );

        // 3. 현재 상태와 새로운 데이터를 여행 순서 기준으로 병합하고 정렬
        const mergedRoutes = [...currentRoutes, ...newRoutes].sort(
          (a, b) => (a.routeOrder ?? 0) - (b.routeOrder ?? 0)
        );

        // 4. 추가된 장소들도 동일한 순서로 업데이트
        const updatedAddedPlaces = mergedRoutes.map((route) => ({
          placeId: route.placeId,
          lat: route.latitude,
          lng: route.longitude,
        }));

        return {
          travelRoute: mergedRoutes,
          addedPlaces: updatedAddedPlaces,
        };
      });
    } catch (error) {
      console.error('[여행 경로 가져오기] 오류 발생:', error);
    }
  },
}));
