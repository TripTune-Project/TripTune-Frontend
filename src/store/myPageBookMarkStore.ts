import { create } from 'zustand';

// 마이페이지 북마크 상태를 관리하는 인터페이스
interface BookMarkState {
  currentPage: number; // 현재 페이지 번호
  
  // 상태를 업데이트하는 함수들
  setCurrentPage: (page: number) => void; // 현재 페이지를 설정
}

// Zustand로 북마크 목록 State 상태를 생성
export const useMyPageBookMarkStore = create<BookMarkState>((set) => ({
  currentPage: 1, // 초기 현재 페이지는 1
  
  // 현재 페이지 설정 함수
  setCurrentPage: (page) => set({ currentPage: page }),
  
}));
