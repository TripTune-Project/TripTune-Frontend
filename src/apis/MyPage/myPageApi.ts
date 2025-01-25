import { get, patch } from '../Common/api';
import { BookmarkResponse } from '@/types/myPage';

// 마이페이지 - 프로필 관리
// 회원정보 조회
export const getMyPage = async () => {
  const url = '/api/members/profile';

  try {
    return await get<{
      success: boolean;
      data: {
        userId: string;
        email: string;
        nickname: string;
        createdAt: string;
        profileImage: string;
      };
      message: string;
    }>(url, { requiresAuth: true });
  } catch (error: any) {
    console.error('마이페이지 정보 조회 중 오류 발생:', error);
    throw new Error(error.message);
  }
};

// 프로필 수정 / 업데이트 (PATCH)
export const updateMyPage = async (
  nickname: string,
  profileImage: File | null
): Promise<{ success: boolean; message: string }> => {
  const url = `/api/members/profile`;

  const formData = new FormData();
  formData.append('nickname', nickname);
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  try {
    return await patch<{ success: boolean; message: string }>(url, formData, {
      requiresAuth: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error: any) {
    console.error('마이페이지 정보 업데이트 중 오류 발생:', error);
    throw new Error(error.message);
  }
};

// 마이페이지 - 계정 관리
// 이메일 인증, 검증은 Verify 파일에서 관리
// TODO : 사용자 계정 정보 조회 -> 확인중!

// 비밀번호 변경 (PATCH)
export const changePassword = async (
  nowPassword: string,
  newPassword: string,
  rePassword: string
) => {
  const url = '/api/members/account/change-password';

  try {
    return await patch<{ success: boolean; message: string }>(
      url,
      { nowPassword, newPassword, rePassword },
      { requiresAuth: true }
    );
  } catch (error: any) {
    console.error('비밀번호 변경 중 오류 발생:', error);
    throw new Error(error.message);
  }
};

// 회원 탈퇴 (PATCH)
export const deactivateAccount = async (password: string) => {
  const url = '/api/members/deactivate';

  try {
    return await patch<{ success: boolean; message: string }>(
      url,
      { password },
      { requiresAuth: true }
    );
  } catch (error: any) {
    console.error('회원 탈퇴 중 오류 발생:', error);
    throw new Error(error.message);
  }
};

// 마이페이지 - 북마크
// 북마크 조회 (GET)
export const getBookmarks = async (
  page: number = 1,
  orderBy: 'newest' | 'oldest' | 'name' = 'newest'
): Promise<{
  success: boolean;
  data?: BookmarkResponse;
  message: string;
}> => {
  const url = `/api/members/bookmarks?page=${page}&orderBy=${orderBy}`;

  try {
    return await get<{
      success: boolean;
      data: BookmarkResponse;
      message: string;
    }>(url, { requiresAuth: true });
  } catch (error: any) {
    console.error('북마크 조회에 실패:', error);
    throw new Error(error.message);
  }
};
