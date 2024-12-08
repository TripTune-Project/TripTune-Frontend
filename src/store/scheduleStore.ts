import { create } from 'zustand';
import { Place, Schedule } from '@/types/scheduleType';
import { fetchScheduleDetail } from '@/api/scheduleApi';

interface Makers {
  placeId: number;
  lat: number;
  lng: number;
}

interface TravelStore {
  addedPlaces: Makers[];
  travelRoute: Place[];
  scheduleDetail: Schedule;
  
  addPlace: (place: Makers) => void;
  removePlace: (placeId: number) => void;
  onMovePlace: (dragIndex: number, hoverIndex: number) => void;
  addPlaceToRoute: (place: Place) => void;
  removePlaceFromRoute: (placeId: number) => void;
  
  setScheduleDetail: (schedule: Schedule) => void;
  fetchScheduleDetailById: (scheduleId: string, page: number) => Promise<void>;
  updateScheduleDetail: (schedule: Schedule) => void;
}

export const useTravelStore = create<TravelStore>((set) => ({
  addedPlaces: [],
  travelRoute: [],
  scheduleDetail: {},
  
  addPlace: (place: Makers) =>
    set((state) => {
      if (state.addedPlaces.some((p) => p.placeId === place.placeId)) {
        return state;
      }
      return { addedPlaces: [...state.addedPlaces, place] };
    }),
  
  removePlace: (placeId: number) =>
    set((state) => ({
      addedPlaces: state.addedPlaces.filter(
        (place) => place.placeId !== placeId,
      ),
    })),
  
  addPlaceToRoute: (place: Place) =>
    set((state) => {
      const updatedRoute = state.travelRoute.some(
        (p) => p.placeId === place.placeId,
      )
        ? state.travelRoute
        : [...state.travelRoute, place];
      return { travelRoute: updatedRoute };
    }),
  
  removePlaceFromRoute: (placeId: number) =>
    set((state) => ({
      travelRoute: state.travelRoute.filter(
        (place) => place.placeId !== placeId,
      ),
    })),
  
  onMovePlace: (dragIndex: number, hoverIndex: number) =>
    set((state) => {
      const updatedRoute = [...state.travelRoute];
      const [movedItem] = updatedRoute.splice(dragIndex, 1);
      updatedRoute.splice(hoverIndex, 0, movedItem);
      return { travelRoute: updatedRoute };
    }),
  
  setScheduleDetail: (schedule: Schedule) => set({ scheduleDetail: schedule }),
  
  fetchScheduleDetailById: async (scheduleId: string, page: number) => {
    try {
      const result = await fetchScheduleDetail(Number(scheduleId), page);
      if (result.success) {
        set({ scheduleDetail: result.data });
      } else {
        console.error('Failed to fetch schedule detail:', result.message);
      }
    } catch (error) {
      console.error('Error fetching schedule detail:', error);
    }
  },
  
  updateScheduleDetail: (updates: Partial<Schedule>) =>
    set((state) => ({
      scheduleDetail: {
        ...state.scheduleDetail,
        ...updates,
      },
    })),
}));
