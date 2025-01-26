import { get, patch } from '../api';
import { BookmarkResponse } from '@/types/myPage';

// 마이페이지 - 프로필 관리
// 회원정보 조회
export const getMyPage = async () => {
  const url = '/api/members/profile';
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
  return await patch<{ success: boolean; message: string }>(url, formData, {
    requiresAuth: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 마이페이지 - 계정 관리
// 이메일 인증, 검증은 Verify 파일에서 관리

// 비밀번호 변경 (PATCH)
export const changePassword = async (
  nowPassword: string,
  newPassword: string,
  rePassword: string
) => {
  const url = '/api/members/account/change-password';
  return await patch<{ success: boolean; message: string }>(
    url,
    { nowPassword, newPassword, rePassword },
    { requiresAuth: true }
  );
};

// 회원 탈퇴 (PATCH)
export const deactivateAccount = async (password: string) => {
  const url = '/api/members/deactivate';
  return await patch<{ success: boolean; message: string }>(
    url,
    { password },
    { requiresAuth: true }
  );
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
  return await get<{
    success: boolean;
    data: BookmarkResponse;
    message: string;
  }>(url, { requiresAuth: true });
};
