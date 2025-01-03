import { create } from 'zustand';
import { Place, Schedule } from '@/types/scheduleType';
import { fetchScheduleDetail } from '@/apis/Schedule/scheduleApi';

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
}

// Zustand로 TravelStore 상태를 생성
export const useTravelStore = create<TravelStore>((set) => ({
  addedPlaces: [], // 초기 추가된 장소 리스트
  travelRoute: [], // 초기 여행 경로 리스트
  scheduleDetail: {}, // 초기 일정 세부 정보

  // 장소 추가
  addPlace: (place: Makers) =>
    set((state) => {
      // 이미 추가된 장소인지 확인
      if (state.addedPlaces.some((p) => p.placeId === place.placeId)) {
        return state; // 이미 추가된 경우 상태 변경 없음
      }
      return { addedPlaces: [...state.addedPlaces, place] }; // 새로운 장소 추가
    }),

  // 장소 제거
  removePlace: (placeId: number) =>
    set((state) => ({
      addedPlaces: state.addedPlaces.filter(
        (place) => place.placeId !== placeId // ID가 일치하지 않는 장소만 유지
      ),
    })),

  // 여행 경로에 장소 추가
  addPlaceToRoute: (place: Place) =>
    set((state) => {
      const updatedRoute = state.travelRoute.some(
        (p) => p.placeId === place.placeId // 이미 추가된 장소인지 확인
      )
        ? state.travelRoute // 이미 추가된 경우 기존 경로 유지
        : [...state.travelRoute, place]; // 새로운 장소 추가
      return { travelRoute: updatedRoute };
    }),

  // 여행 경로에서 장소 제거
  removePlaceFromRoute: (placeId: number) =>
    set((state) => ({
      travelRoute: state.travelRoute.filter(
        (place) => place.placeId !== placeId // ID가 일치하지 않는 장소만 유지
      ),
    })),

  // 여행 경로에서 장소 이동 (드래그 앤 드롭)
  onMovePlace: (dragIndex: number, hoverIndex: number) =>
    set((state) => {
      const updatedRoute = [...state.travelRoute];
      const [movedItem] = updatedRoute.splice(dragIndex, 1); // 드래그한 장소를 제거
      updatedRoute.splice(hoverIndex, 0, movedItem); // 새로운 위치에 삽입
      return { travelRoute: updatedRoute };
    }),

  // 일정 세부 정보를 설정
  setScheduleDetail: (schedule: Schedule) => set({ scheduleDetail: schedule }),

  // 일정 세부 정보를 ID로 가져오기
  fetchScheduleDetailById: async (scheduleId: string, page: number) => {
    try {
      const result = await fetchScheduleDetail(Number(scheduleId), page);
      if (result.success) {
        set({ scheduleDetail: result.data }); // 성공 시 데이터 설정
      } else {
        console.error('Failed to fetch schedule detail:', result.message); // 실패 메시지 출력
      }
    } catch (error) {
      console.error('Error fetching schedule detail:', error); // 오류 출력
    }
  },

  // 일정 세부 정보를 업데이트
  updateScheduleDetail: (updates: Partial<Schedule>) =>
    set((state) => ({
      scheduleDetail: {
        ...state.scheduleDetail, // 기존 세부 정보
        ...updates, // 업데이트할 정보 병합
      },
    })),
}));
