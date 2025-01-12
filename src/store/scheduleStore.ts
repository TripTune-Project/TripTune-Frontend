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
  deletedPlaces : unknown;
}

// Zustand로 TravelStore 상태를 생성
export const useTravelStore = create<TravelStore>((set) => ({
  addedPlaces: [], // 초기 추가된 장소 리스트
  travelRoute: [], // 초기 여행 경로 리스트
  scheduleDetail: {}, // 초기 일정 세부 정보
  deletedPlaces: [], // 삭제된 장소를 저장
  
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
        (place) => place.placeId !== placeId,
      );
      const updatedAddedPlaces = state.addedPlaces.filter(
        (place) => place.placeId !== placeId,
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
        (p) => p.placeId === place.placeId,
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
          (place) => place.placeId !== placeId,
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
  
  // 일정 세부 정보를 ID로 가져오기 (원래 코드를 그대로 유지)
  fetchScheduleDetailById: async (scheduleId: string, page: number) => {
    try {
      const result = await fetchScheduleDetail(Number(scheduleId), page);
      if (result.success) {
        set(() => {
          return { scheduleDetail: result.data };
        });
      } else {
        console.error(
          '일정 세부 정보를 가져오는데 실패했습니다:',
          result.message,
        );
      }
    } catch (error) {
      console.error('일정 세부 정보를 가져오는 중 오류 발생:', error);
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
      let currentPage = 1; // 현재 페이지
      let totalPages = 1; // 총 페이지 수
      let allRoutes: Place[] = []; // 모든 페이지 데이터를 담을 배열
      
      while (currentPage <= totalPages) {
        const response = await fetchTravelRoute(scheduleId, currentPage);
        
        if (response.success) {
          const { data } = response;
          totalPages = data.totalPages; // 총 페이지 수 업데이트
          allRoutes = [...allRoutes, ...data.content];
          currentPage++; // 다음 페이지로 이동
        } else {
          console.error(
            `[fetchAndMergeRoutes] 페이지 ${currentPage} 조회 실패`,
          );
          break; // 실패 시 반복 중단
        }
      }
      
      set((state) => {
        const mergedRoutes = [
          ...allRoutes.filter(
            (newRoute) =>
              !state.travelRoute.some(
                (route) => route.placeId === newRoute.placeId,
              ) &&
              !state.deletedPlaces.includes(newRoute.placeId), // 삭제된 장소 제외
          ),
          ...state.travelRoute,
        ];
        
        return {
          travelRoute: mergedRoutes,
          addedPlaces: mergedRoutes.map((route) => ({
            placeId: route.placeId,
            lat: route.latitude,
            lng: route.longitude,
          })),
        };
      });
    } catch (error) {
      console.error('%c[fetchAndMergeRoutes] 오류 발생:', 'color: red;', error);
    }
  },
}));
