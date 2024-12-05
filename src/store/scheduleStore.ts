import { create } from 'zustand';
import { Place } from '@/types/scheduleType';

interface Makers {
  placeId: number;
  lat: number;
  lng: number;
}

interface TravelStore {
  addedPlaces: Makers[];
  addPlace: (place: Makers) => void;
  removePlace: (placeId: number) => void;
  
  travelRoute: Place[];
  onMovePlace: (dragIndex: number, hoverIndex: number) => void;
  addPlaceToRoute: (place: Place) => void;
  removePlaceFromRoute: (placeId: number) => void;
}

export const useTravelStore = create<TravelStore>((set) => ({
  addedPlaces: [],
  travelRoute: [],
  
  addPlace: (place: Makers) =>
    set((state) => {
      if (state.addedPlaces.some((p) => p.placeId === place.placeId)) {
        return state;
      }
      return { addedPlaces: [...state.addedPlaces, place] };
    }),
  removePlace: (placeId: number) =>
    set((state) => ({
      addedPlaces: state.addedPlaces.filter((place) => place.placeId !== placeId),
    })),
  addPlaceToRoute: (place: Place) =>
    set((state) => {
      console.log(place, 'place: ');
      const updatedRoute = state.travelRoute.some((p) => p.placeId === place.placeId)
        ? state.travelRoute
        : [...state.travelRoute, place];
      console.log(updatedRoute, 'updatedRoute: ');
      return { travelRoute: updatedRoute };
    }),
  removePlaceFromRoute: (placeId: number) =>
    set((state) => ({
      travelRoute: state.travelRoute.filter((place) => place.placeId !== placeId),
    })),
  onMovePlace: (dragIndex: number, hoverIndex: number) =>
    set((state) => {
      const updatedRoute = [...state.travelRoute];
      const [movedItem] = updatedRoute.splice(dragIndex, 1);
      updatedRoute.splice(hoverIndex, 0, movedItem);
      return { travelRoute: updatedRoute };
    }),
}));
