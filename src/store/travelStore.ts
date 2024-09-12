import { create } from 'zustand';

interface TravelState {
  currentPage: number;
  searchTerm: string;
  isSearching: boolean;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setIsSearching: (searching: boolean) => void;
}

export const useTravelStore = create<TravelState>((set) => ({
  currentPage: 1,
  searchTerm: '',
  isSearching: false,
  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setIsSearching: (searching) => set({ isSearching: searching }),
}));
