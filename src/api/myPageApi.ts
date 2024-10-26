import { get, post, patch, remove } from './api';

const handleApiError = (error: Error, defaultMessage: string) => {
  const message = error?.message || defaultMessage;
  console.error(message);
  alert(message);
};

interface Profile {
  userId: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
}

interface Schedule {
  scheduleId: number;
  scheduleName: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ScheduleResponse {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  content: Schedule[];
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

// 마이페이지 정보 조회 (GET)
export const getMyPage = async () => {
  try {
    const response = await get<{
      success: boolean;
      data: {
        userId: string;
        nickname: string;
        since: string;
        profileImage: string;
      };
      message: string;
    }>('/mypage', { requiresAuth: true });

    if (response.success) {
      console.log('마이페이지 정보 조회 성공:', response.data);
      return response.data;
    } else {
      console.error('마이페이지 정보 조회 실패:', response.message);
    }
  } catch (error) {
    handleApiError(
      error as Error,
      '마이페이지 정보 조회 중 오류가 발생했습니다.'
    );
  }
};

// 내 일정 목록 조회 (GET)
export const getMySchedules = async (currentPage: number = 1) => {
  try {
    const response = await get<{
      success: boolean;
      data: ScheduleResponse;
      message: string;
    }>(`/mypage/schedules?page=${currentPage}`, { requiresAuth: true });

    if (response.success) {
      console.log('내 일정 목록 조회 성공:', response.data);
      return response.data;
    } else {
      console.error('일정 목록 조회 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error as Error, '내 일정 목록 조회 중 오류가 발생했습니다.');
  }
};

// 내 일정 삭제 (DELETE)
export const deleteSchedule = async (scheduleId: number) => {
  try {
    const response = await remove<{ success: boolean; message: string }>(
      `/mypage/schedules/${scheduleId}`,
      { requiresAuth: true }
    );

    if (response.success) {
      console.log('일정 삭제 성공:', response.message);
    } else {
      console.error('일정 삭제 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error as Error, '일정 삭제 중 오류가 발생했습니다.');
  }
};

// 내 일정에 장소 추가 (POST)
export const addPlaceToSchedule = async (
  scheduleId: number,
  placeId: number
) => {
  try {
    const response = await post<{ success: boolean; message: string }>(
      `/mypage/schedules/${scheduleId}`,
      { placeId },
      { requiresAuth: true }
    );

    if (response.success) {
      console.log('일정에 장소 추가 성공:', response.message);
    } else {
      console.error('일정에 장소 추가 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error as Error, '일정에 장소 추가 중 오류가 발생했습니다.');
  }
};

// 북마크 조회 (GET)
export const getBookmarks = async (page: number = 1) => {
  try {
    const response = await get<{
      success: boolean;
      data: BookmarkResponse;
      message: string;
    }>(`/mypage/bookmarks?page=${page}`, { requiresAuth: true });

    if (response.success) {
      console.log('북마크 목록 조회 성공:', response.data);
      return response.data;
    } else {
      console.error('북마크 조회 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error as Error, '북마크 목록 조회 중 오류가 발생했습니다.');
  }
};

// 회원정보 조회 (GET)
export const getProfile = async () => {
  try {
    const response = await get<{
      success: boolean;
      data: Profile;
      message: string;
    }>('/mypage/profile', { requiresAuth: true });

    if (response.success) {
      console.log('회원정보 조회 성공:', response.data);
      return response.data;
    } else {
      console.error('회원정보 조회 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error as Error, '회원정보 조회 중 오류가 발생했습니다.');
  }
};

// 회원정보 수정 (PATCH)
export const updateProfile = async (
  nickname: string,
  profileImage: File | null
) => {
  const formData = new FormData();
  formData.append('nickname', nickname);
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  try {
    const response = await patch<{
      success: boolean;
      message: string;
    }>('/mypage/profile', formData, {
      requiresAuth: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.success) {
      console.log('회원정보 수정 성공:', response.message);
    } else {
      console.error('회원정보 수정 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error as Error, '회원정보 수정 중 오류가 발생했습니다.');
  }
};

// 회원 탈퇴 (PATCH)
export const deactivateAccount = async (password: string) => {
  try {
    const response = await patch<{
      success: boolean;
      message: string;
    }>('/mypage/profile/deactivate', { password }, { requiresAuth: true });

    if (response.success) {
      console.log('회원 탈퇴 성공:', response.message);
    } else {
      console.error('회원 탈퇴 실패:', response.message);
    }
  } catch (error) {
    handleApiError(error as Error, '회원 탈퇴 중 오류가 발생했습니다.');
  }
};

// 비밀번호 변경 (PATCH)
export const changePassword = async (
  nowPassword: string,
  newPassword: string,
  rePassword: string
) => {
  try {
    const response = await patch<{
      success: boolean;
      message: string;
    }>(
      '/mypage/change-password',
      {
        nowPassword,
        newPassword,
        rePassword,
      },
      { requiresAuth: true }
    );

    if (response.success) {
      console.log('비밀번호 변경 성공:', response.message);
    } else {
      console.error('비밀번호 변경 실패:', response.message);
      if (response.message.includes('일치하지 않습니다')) {
        alert('새 비밀번호가 일치하지 않습니다.');
      }
    }
  } catch (error) {
    handleApiError(error as Error, '비밀번호 변경 중 오류가 발생했습니다.');
  }
};
