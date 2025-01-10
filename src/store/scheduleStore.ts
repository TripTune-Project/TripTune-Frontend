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
}

// Zustand로 TravelStore 상태를 생성
export const useTravelStore = create<TravelStore>((set, get) => ({
  addedPlaces: [], // 초기 추가된 장소 리스트
  travelRoute: [], // 초기 여행 경로 리스트
  scheduleDetail: {}, // 초기 일정 세부 정보
  
  // 장소 추가
  addPlace: (place: Makers) =>
    set((state) => {
      console.log('%c[addPlace] 과거 상태:', 'color: green;', state.addedPlaces);
      const updatedState = state.addedPlaces.some((p) => p.placeId === place.placeId)
        ? state
        : { addedPlaces: [...state.addedPlaces, place] };
      console.log('%c[addPlace] 현재 상태:', 'color: orange;', state.addedPlaces);
      console.log('%c[addPlace] 미래 상태:', 'color: blue;', updatedState.addedPlaces);
      return updatedState;
    }),
  
  // 장소 제거
  removePlace: (placeId: number) =>
    set((state) => {
      console.log('%c[removePlace] 과거 상태:', 'color: green;', state.addedPlaces);
      const updatedState = {
        addedPlaces: state.addedPlaces.filter((place) => place.placeId !== placeId),
      };
      console.log('%c[removePlace] 현재 상태:', 'color: orange;', state.addedPlaces);
      console.log('%c[removePlace] 미래 상태:', 'color: blue;', updatedState.addedPlaces);
      return updatedState;
    }),
  
  // 여행 경로에 장소 추가
  addPlaceToRoute: (place: Place) =>
    set((state) => {
      console.log('%c[addPlaceToRoute] 과거 상태:', 'color: green;', state.travelRoute);
      const updatedRoute = state.travelRoute.some((p) => p.placeId === place.placeId)
        ? state.travelRoute
        : [...state.travelRoute, place];
      const updatedState = { travelRoute: updatedRoute };
      console.log('%c[addPlaceToRoute] 현재 상태:', 'color: orange;', state.travelRoute);
      console.log('%c[addPlaceToRoute] 미래 상태:', 'color: blue;', updatedState.travelRoute);
      return updatedState;
    }),
  
  // 여행 경로에서 장소 제거
  removePlaceFromRoute: (placeId: number) =>
    set((state) => {
      console.log('%c[removePlaceFromRoute] 과거 상태:', 'color: green;', state.travelRoute);
      const updatedState = {
        travelRoute: state.travelRoute.filter((place) => place.placeId !== placeId),
      };
      console.log('%c[removePlaceFromRoute] 현재 상태:', 'color: orange;', state.travelRoute);
      console.log('%c[removePlaceFromRoute] 미래 상태:', 'color: blue;', updatedState.travelRoute);
      return updatedState;
    }),
  
  // 여행 경로에서 장소 이동 (드래그 앤 드롭)
  onMovePlace: (dragIndex: number, hoverIndex: number) =>
    set((state) => {
      console.log('%c[onMovePlace] 과거 상태:', 'color: green;', state.travelRoute);
      const updatedRoute = [...state.travelRoute];
      const [movedItem] = updatedRoute.splice(dragIndex, 1);
      updatedRoute.splice(hoverIndex, 0, movedItem);
      const updatedState = { travelRoute: updatedRoute };
      console.log('%c[onMovePlace] 현재 상태:', 'color: orange;', state.travelRoute);
      console.log('%c[onMovePlace] 미래 상태:', 'color: blue;', updatedState.travelRoute);
      return updatedState;
    }),
  
  // 일정 세부 정보를 설정
  setScheduleDetail: (schedule: Schedule) =>
    set((state) => {
      console.log('%c[setScheduleDetail] 과거 상태:', 'color: green;', state.scheduleDetail);
      const updatedState = { scheduleDetail: schedule };
      console.log('%c[setScheduleDetail] 현재 상태:', 'color: orange;', state.scheduleDetail);
      console.log('%c[setScheduleDetail] 미래 상태:', 'color: blue;', updatedState.scheduleDetail);
      return updatedState;
    }),
  
  // 일정 세부 정보를 ID로 가져오기 (원래 코드를 그대로 유지)
  fetchScheduleDetailById: async (scheduleId: string, page: number) => {
    try {
      const result = await fetchScheduleDetail(Number(scheduleId), page);
      if (result.success) {
        set((state) => {
          console.log('%c[fetchScheduleDetailById] 과거 상태:', 'color: green;', state.scheduleDetail);
          const updatedState = { scheduleDetail: result.data };
          console.log('%c[fetchScheduleDetailById] 현재 상태:', 'color: orange;', state.scheduleDetail);
          console.log('%c[fetchScheduleDetailById] 미래 상태:', 'color: blue;', updatedState.scheduleDetail);
          return updatedState;
        });
      } else {
        console.error('일정 세부 정보를 가져오는데 실패했습니다:', result.message);
      }
    } catch (error) {
      console.error('일정 세부 정보를 가져오는 중 오류 발생:', error);
    }
  },
  
  // 일정 세부 정보를 업데이트
  updateScheduleDetail: (updates: Partial<Schedule>) =>
    set((state) => {
      console.log('%c[updateScheduleDetail] 과거 상태:', 'color: green;', state.scheduleDetail);
      const updatedState = {
        scheduleDetail: {
          ...state.scheduleDetail,
          ...updates,
        },
      };
      console.log('%c[updateScheduleDetail] 현재 상태:', 'color: orange;', state.scheduleDetail);
      console.log('%c[updateScheduleDetail] 미래 상태:', 'color: blue;', updatedState.scheduleDetail);
      return updatedState;
    }),
  
  // 과거 데이터와 새로운 데이터를 병합
  fetchAndMergeRoutes: async (scheduleId: number) => {
    try {
      console.log('%c[fetchAndMergeRoutes] 데이터 조회 시작...', 'color: purple;');
      let currentPage = 1; // 현재 페이지
      let totalPages = 1; // 총 페이지 수
      let allRoutes: Place[] = []; // 모든 페이지 데이터를 담을 배열
      
      // 모든 페이지 데이터를 가져올 때까지 반복
      while (currentPage <= totalPages) {
        const response = await fetchTravelRoute(scheduleId, currentPage); // API 요청
        
        if (response.success) {
          const { data } = response;
          totalPages = data.totalPages; // 총 페이지 수 업데이트
          console.log(
            `%c[fetchAndMergeRoutes] 페이지 ${currentPage} 데이터:`,
            'color: green;',
            data.content
          );
          
          // 현재 페이지 데이터를 병합
          allRoutes = [...allRoutes, ...data.content];
          currentPage++; // 다음 페이지로 이동
        } else {
          console.error(`[fetchAndMergeRoutes] 페이지 ${currentPage} 조회 실패`);
          break; // 실패 시 반복 중단
        }
      }
      
      // 상태에 병합된 데이터를 반영
      set((state) => {
        console.log('%c[fetchAndMergeRoutes] 기존 상태:', 'color: orange;', state.travelRoute);
        const mergedRoutes = [
          ...allRoutes.filter(
            (newRoute) => !state.travelRoute.some((route) => route.placeId === newRoute.placeId)
          ),
          ...state.travelRoute,
        ];
        console.log('%c[fetchAndMergeRoutes] 병합된 데이터:', 'color: blue;', mergedRoutes);
        return { travelRoute: mergedRoutes };
      });
    } catch (error) {
      console.error('%c[fetchAndMergeRoutes] 오류 발생:', 'color: red;', error);
    }
  },
}));
