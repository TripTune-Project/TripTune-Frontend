import { get, patch } from '../Common/api';

interface Profile {
  userId: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
}

interface Bookmark {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  ThumbnailUrl: string;
}

interface BookmarkResponse {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  content: Bookmark[];
}

// 마이페이지 회원 정보 조회 (GET)
export const getMyPage = async () => {
  const url = ' /api/mypage/profile';

  try {
    return await get<{
      success: boolean;
      data: {
        userId: string;
        nickname: string;
        since: string;
        profileImage: string;
      };
      message: string;
    }>(url, { requiresAuth: true });
  } catch (error: any) {
    console.error('마이페이지 정보 조회 중 오류 발생:', error);
    throw new Error(error.message);
  }
};

// 북마크 조회 (GET)
// TODO : orderby ?
export const getBookmarks = async (page: number = 1) => {
  const url = `/api/mypage/bookmarks?page=${page}`;

  try {
    return await get<{
      success: boolean;
      data: BookmarkResponse;
      message: string;
    }>(url, { requiresAuth: true });
  } catch (error: any) {
    console.error('북마크 목록 조회 중 오류 발생:', error);
    throw new Error(error.message);
  }
};

// 회원정보 조회 (GET)
export const getProfile = async () => {
  const url = '/api/mypage/profile';

  try {
    return await get<{
      success: boolean;
      data: Profile;
      message: string;
    }>(url, { requiresAuth: true });
  } catch (error: any) {
    console.error('회원정보 조회 중 오류 발생:', error);
    throw new Error(error.message);
  }
};

// 마이페이지 회원정보 프로필 수정 (PATCH)
export const updateProfile = async (
  nickname: string,
  profileImage: File | null
) => {
  const url = '/api/mypage/profile';
  const formData = new FormData();
  formData.append('nickname', nickname);
  if (profileImage) formData.append('profileImage', profileImage);

  try {
    return await patch<{ success: boolean; message: string }>(url, formData, {
      requiresAuth: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error: any) {
    console.error('회원정보 수정 중 오류 발생:', error);
    throw new Error(error.message);
  }
};

// 회원 탈퇴 (PATCH)
export const deactivateAccount = async (password: string) => {
  const url = '/api/mypage/account/deactivate';

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

// 비밀번호 변경 (PATCH)
export const changePassword = async (
  nowPassword: string,
  newPassword: string,
  rePassword: string
) => {
  const url = '/api/mypage/account/change-password';

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
