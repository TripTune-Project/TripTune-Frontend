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

  // 여행 루트 초기화
  resetTravelRoute: () => void;
}

// 초기 상태 타입 정의 강화
const initialState: Pick<TravelStore, 'addedPlaces' | 'travelRoute' | 'scheduleDetail' | 'deletedPlaces'> = {
  addedPlaces: [], // 초기 추가된 장소 리스트
  travelRoute: [], // 초기 여행 경로 리스트
  scheduleDetail: {} as Schedule, // 초기 일정 세부 정보
  deletedPlaces: [], // 삭제된 장소 ID 리스트
};

// Zustand로 여행 상태 저장소 생성
export const useTravelStore = create<TravelStore>((set) => ({
  ...initialState, // 초기 상태 설정

  // 장소 추가 - 중복 체크 강화
  addPlace: (place: Makers) =>
    set((state) => {
      // 이미 존재하는 장소인지 확인
      const isDuplicate = state.addedPlaces.some((p) => p.placeId === place.placeId);
      
      if (isDuplicate) {
        return state; // 중복인 경우 상태 변경 없음
      }
      
      // 삭제된 장소 목록에서 제거 (만약 이전에 삭제되었던 장소라면)
      const updatedDeletedPlaces = state.deletedPlaces.filter(id => id !== place.placeId);
      
      return {
        addedPlaces: [...state.addedPlaces, place],
        deletedPlaces: updatedDeletedPlaces
      };
    }),
  
  // 장소 제거 - 순서 정리 및 상태 일관성 유지
  removePlace: (placeId: number) =>
    set((state) => {
      // 이미 삭제된 장소인지 확인
      if (state.deletedPlaces.includes(placeId)) {
        return state; // 이미 삭제된 경우 상태 변경 없음
      }
      
      // 여행 경로에서 장소 제거
      const updatedTravelRoute = state.travelRoute.filter(
        (place) => place.placeId !== placeId
      );
      
      // 추가된 장소 목록에서 제거
      const updatedAddedPlaces = state.addedPlaces.filter(
        (place) => place.placeId !== placeId
      );
      
      // 삭제된 장소 ID 목록에 추가 (중복 방지)
      const updatedDeletedPlaces = [...state.deletedPlaces];
      if (!updatedDeletedPlaces.includes(placeId)) {
        updatedDeletedPlaces.push(placeId);
      }
      
      // 경로 순서 재정렬
      const reorderedTravelRoute = updatedTravelRoute.map((place, index) => ({
        ...place,
        routeOrder: index + 1
      }));
  
      return {
        travelRoute: reorderedTravelRoute,
        addedPlaces: updatedAddedPlaces,
        deletedPlaces: updatedDeletedPlaces,
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

      // 병합 전에 상태를 초기화하여 중복 방지
      set((state) => ({
        ...state,
        deletedPlaces: [] // 병합 시 삭제된 장소 리스트 초기화
      }));
  
      // 모든 페이지의 데이터를 가져옴
      while (currentPage <= totalPages) {
        const response = await fetchTravelRoute(scheduleId, currentPage);
  
        if (response.success) {
          const { data } = response;
          totalPages = data.totalPages;
          
          // 이미 수집된 데이터와 중복되지 않는 항목만 추가
          const newContent = data.content.filter(
            (newItem) => !allRoutes.some((route) => route.placeId === newItem.placeId)
          );
          
          allRoutes = [...allRoutes, ...newContent];
          currentPage++;
        } else {
          console.error(`[여행 경로 가져오기] ${currentPage}페이지 조회 실패`);
          break;
        }
      }
      
      // 여행 순서를 기준으로 정렬
      allRoutes = allRoutes.sort((a, b) => (a.routeOrder ?? 0) - (b.routeOrder ?? 0));
  
      set((state) => {
        // 중복 제거를 위한 맵 생성 (placeId를 키로 사용)
        const routeMap = new Map<number, Place>();
        
        // 서버에서 가져온 경로를 맵에 추가
        allRoutes.forEach(route => {
          routeMap.set(route.placeId, route);
        });
        
        // 현재 상태에 있는 경로 중 삭제되지 않은 항목을 맵에 추가 (기존 항목 유지)
        state.travelRoute.forEach(route => {
          if (!state.deletedPlaces.includes(route.placeId) && !routeMap.has(route.placeId)) {
            routeMap.set(route.placeId, route);
          }
        });
        
        // 맵의 값을 배열로 변환하고 정렬
        const mergedRoutes = Array.from(routeMap.values()).sort(
          (a, b) => (a.routeOrder ?? 0) - (b.routeOrder ?? 0)
        );
        
        // 루트 순서 재할당 (1부터 시작하는 연속적인 숫자로)
        const reorderedRoutes = mergedRoutes.map((route, index) => ({
          ...route,
          routeOrder: index + 1
        }));
  
        // 추가된 장소들도 동일한 순서로 업데이트
        const updatedAddedPlaces = reorderedRoutes.map((route) => ({
          placeId: route.placeId,
          lat: route.latitude,
          lng: route.longitude,
        }));
  
        return {
          travelRoute: reorderedRoutes,
          addedPlaces: updatedAddedPlaces,
        };
      });
    } catch (error) {
      console.error('[여행 경로 가져오기] 오류 발생:', error);
    }
  },

  // 여행 루트 초기화
  resetTravelRoute: () =>
    set(() => ({
      addedPlaces: [],
      travelRoute: [],
      deletedPlaces: [],
    })),
}));
