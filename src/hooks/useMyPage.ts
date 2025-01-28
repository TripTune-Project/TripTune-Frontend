import { create } from 'zustand';
import { getMyPage, updateMyPage } from '@/apis/MyPage/myPageApi';

type UserData = {
  userId: string;
  nickname: string;
  profileImage: string;
  email?: string; // 이메일 추가
};

type MyPageState = {
  userData: UserData | null;
  isEmailLoaded: boolean; // 이메일이 로드되었는지 확인하는 상태
  fetchUserData: () => Promise<void>;
  updateUserData: (
    nickname: string,
    profileImage?: File | null
  ) => Promise<void>;
};

export const useMyPage = create<MyPageState>((set) => ({
  userData: null,
  isEmailLoaded: false, // 이메일 로드 상태 초기화

  // 회원 정보 조회
  fetchUserData: async () => {
    try {
      const response = await getMyPage();
      if (response.success) {
        set({ userData: response.data, isEmailLoaded: true }); // 이메일 로드 상태 업데이트
      } else {
        console.error('회원 정보 조회 실패:', response.message);
      }
    } catch (error) {
      console.error('회원 정보 조회 중 오류:', error);
    }
  },

  // 회원 정보 업데이트
  updateUserData: async (nickname, profileImage = null) => {
    try {
      const response = await updateMyPage(nickname, profileImage);
      if (response.success) {
        set((state) => ({
          userData: {
            ...state.userData,
            nickname,
            profileImage:
              response.data.profileImage || state.userData?.profileImage,
          },
        }));
        alert('프로필이 성공적으로 업데이트되었습니다.');
      } else {
        alert(`프로필 업데이트 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('회원 정보 업데이트 중 오류:', error);
    }
  },
}));
