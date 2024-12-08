import { create } from 'zustand';

// 여행 상태를 관리하는 인터페이스
interface TravelState {
  currentPage: number; // 현재 페이지 번호
  searchTerm: string; // 검색어
  isSearching: boolean; // 검색 중인지 여부

  // 상태를 업데이트하는 함수들
  setCurrentPage: (page: number) => void; // 현재 페이지를 설정
  setSearchTerm: (term: string) => void; // 검색어를 설정
  setIsSearching: (searching: boolean) => void; // 검색 중 상태를 설정
}

// Zustand로 TravelState 상태를 생성
export const useTravelStore = create<TravelState>((set) => ({
  currentPage: 1, // 초기 현재 페이지는 1
  searchTerm: '', // 초기 검색어는 빈 문자열
  isSearching: false, // 초기 검색 상태는 false

  // 현재 페이지 설정 함수
  setCurrentPage: (page) => set({ currentPage: page }),

  // 검색어 설정 함수
  setSearchTerm: (term) => set({ searchTerm: term }),

  // 검색 중 상태 설정 함수
  setIsSearching: (searching) => set({ isSearching: searching }),
}));
