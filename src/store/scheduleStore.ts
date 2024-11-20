import { create } from 'zustand';
import { Place } from '@/types/scheduleType';

interface TravelStore {
  addedPlaces: Place[];
  addPlace: (place: Place) => void;
  removePlace: (placeId: number) => void;
  movePlace: (dragIndex: number, hoverIndex: number) => void;
}

export const useTravelStore = create<TravelStore>((set) => ({
  addedPlaces: [],
  addPlace: (place) =>
    set((state) => ({
      addedPlaces: state.addedPlaces.some((p) => p.placeId === place.placeId)
        ? state.addedPlaces
        : [...state.addedPlaces, place],
    })),
  removePlace: (placeId) =>
    set((state) => ({
      addedPlaces: state.addedPlaces.filter((p) => p.placeId !== placeId),
    })),
  movePlace: (dragIndex, hoverIndex) =>
    set((state) => {
      const updatedPlaces = [...state.addedPlaces];
      const [movedPlace] = updatedPlaces.splice(dragIndex, 1);
      updatedPlaces.splice(hoverIndex, 0, movedPlace);
      return { addedPlaces: updatedPlaces };
    }),
}));
