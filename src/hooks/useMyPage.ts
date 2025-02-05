import { create } from 'zustand';
import { getMyPage } from '@/apis/MyPage/myPageApi';

type UserData = {
  userId: string;
  nickname: string;
  profileImage: string;
  email: string;
};

type MyPageState = {
  userData: UserData | null;
  fetchUserData: () => Promise<void>;
};

export const useMyPage = create<MyPageState>((set) => ({
  userData: null,

  // 회원 정보 조회
  fetchUserData: async () => {
    try {
      const response = await getMyPage();
      if (response.success) {
        set({ userData: response.data });
      } else {
        console.error('회원 정보 조회 실패:', response.message);
      }
    } catch (error) {
      console.error('회원 정보 조회 중 오류:', error);
    }
  },
}));
