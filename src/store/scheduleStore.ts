import { create } from 'zustand';

interface TravelStore {
  addedPlaces: Set<number>;
  addPlace: (placeId: number) => void;
  removePlace: (placeId: number) => void;
  movePlace: (fromIndex: number, toIndex: number) => void;
}

export const useTravelStore = create<TravelStore>((set) => ({
  addedPlaces: new Set<number>(),
  addPlace: (placeId: number) =>
    set((state) => {
      const updatedPlaces = new Set(state.addedPlaces);
      updatedPlaces.add(placeId);
      return { addedPlaces: updatedPlaces };
    }),
  removePlace: (placeId: number) =>
    set((state) => {
      const updatedPlaces = new Set(
        Array.from(state.addedPlaces).filter((id) => id !== placeId),
      );
      return { addedPlaces: updatedPlaces };
    }),
  movePlace: (fromIndex: number, toIndex: number) =>
    set((state) => {
      const updatedPlaces = Array.from(state.addedPlaces);
      const [movedPlace] = updatedPlaces.splice(fromIndex, 1);
      updatedPlaces.splice(toIndex, 0, movedPlace);
      return { addedPlaces: new Set(updatedPlaces) };
    }),
}));
