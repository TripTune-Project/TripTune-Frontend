import { get, post, patch, remove } from './api';

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
  const url = '/mypage';
  
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
    }>(url, { requiresAuth: true });
    
    console.log(
      response.success ? '마이페이지 정보 조회 성공:' : '마이페이지 정보 조회 실패:',
      response.message
    );
    return response;
  } catch (error) {
    console.error('마이페이지 정보 조회 중 오류 발생:', error);
    throw new Error('서버 내부 오류가 발생했습니다.');
  }
};

// 내 일정 목록 조회 (GET)
export const getMySchedules = async (currentPage: number = 1) => {
  const url = `/mypage/schedules?page=${currentPage}`;
  
  try {
    const response = await get<{
      success: boolean;
      data: ScheduleResponse;
      message: string;
    }>(url, { requiresAuth: true });
    
    console.log(
      response.success ? '내 일정 목록 조회 성공:' : '내 일정 목록 조회 실패:',
      response.message
    );
    return response;
  } catch (error) {
    console.error('내 일정 목록 조회 중 오류 발생:', error);
    throw new Error('서버 내부 오류가 발생했습니다.');
  }
};

// 내 일정 삭제 (DELETE)
export const deleteSchedule = async (scheduleId: number) => {
  const url = `/mypage/schedules/${scheduleId}`;
  
  try {
    const response = await remove<{ success: boolean; message: string }>(url, {
      requiresAuth: true,
    });
    
    console.log(
      response.success ? '일정 삭제 성공:' : '일정 삭제 실패:',
      response.message
    );
    return response;
  } catch (error) {
    console.error('일정 삭제 중 오류 발생:', error);
    throw new Error('서버 내부 오류가 발생했습니다.');
  }
};

// 내 일정에 장소 추가 (POST)
export const addPlaceToSchedule = async (
  scheduleId: number,
  placeId: number
) => {
  const url = `/mypage/schedules/${scheduleId}`;
  
  try {
    const response = await post<{ success: boolean; message: string }>(
      url,
      { placeId },
      { requiresAuth: true }
    );
    
    console.log(
      response.success ? '일정에 장소 추가 성공:' : '일정에 장소 추가 실패:',
      response.message
    );
    return response;
  } catch (error) {
    console.error('일정에 장소 추가 중 오류 발생:', error);
    throw new Error('서버 내부 오류가 발생했습니다.');
  }
};

// 북마크 조회 (GET)
export const getBookmarks = async (page: number = 1) => {
  const url = `/mypage/bookmarks?page=${page}`;
  
  try {
    const response = await get<{
      success: boolean;
      data: BookmarkResponse;
      message: string;
    }>(url, { requiresAuth: true });
    
    console.log(
      response.success ? '북마크 목록 조회 성공:' : '북마크 목록 조회 실패:',
      response.message
    );
    return response;
  } catch (error) {
    console.error('북마크 목록 조회 중 오류 발생:', error);
    throw new Error('서버 내부 오류가 발생했습니다.');
  }
};

// 회원정보 조회 (GET)
export const getProfile = async () => {
  const url = '/mypage/profile';
  
  try {
    const response = await get<{
      success: boolean;
      data: Profile;
      message: string;
    }>(url, { requiresAuth: true });
    
    console.log(
      response.success ? '회원정보 조회 성공:' : '회원정보 조회 실패:',
      response.message
    );
    return response;
  } catch (error) {
    console.error('회원정보 조회 중 오류 발생:', error);
    throw new Error('서버 내부 오류가 발생했습니다.');
  }
};

// 회원정보 수정 (PATCH)
export const updateProfile = async (
  nickname: string,
  profileImage: File | null
) => {
  const url = '/mypage/profile';
  const formData = new FormData();
  formData.append('nickname', nickname);
  if (profileImage) formData.append('profileImage', profileImage);
  
  try {
    const response = await patch<{ success: boolean; message: string }>(
      url,
      formData,
      {
        requiresAuth: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    
    console.log(
      response.success ? '회원정보 수정 성공:' : '회원정보 수정 실패:',
      response.message
    );
    return response;
  } catch (error) {
    console.error('회원정보 수정 중 오류 발생:', error);
    throw new Error('서버 내부 오류가 발생했습니다.');
  }
};

// 회원 탈퇴 (PATCH)
export const deactivateAccount = async (password: string) => {
  const url = '/mypage/profile/deactivate';
  
  try {
    const response = await patch<{ success: boolean; message: string }>(
      url,
      { password },
      { requiresAuth: true }
    );
    
    console.log(
      response.success ? '회원 탈퇴 성공:' : '회원 탈퇴 실패:',
      response.message
    );
    return response;
  } catch (error) {
    console.error('회원 탈퇴 중 오류 발생:', error);
    throw new Error('서버 내부 오류가 발생했습니다.');
  }
};

// 비밀번호 변경 (PATCH)
export const changePassword = async (
  nowPassword: string,
  newPassword: string,
  rePassword: string
) => {
  const url = '/api/mypage/change-password';
  
  try {
    const response = await patch<{ success: boolean; message: string }>(
      url,
      { nowPassword, newPassword, rePassword },
      { requiresAuth: true }
    );
    
    console.log(
      response.success ? '비밀번호 변경 성공:' : '비밀번호 변경 실패:',
      response.message
    );
    return response;
  } catch (error) {
    console.error('비밀번호 변경 중 오류 발생:', error);
    throw new Error('서버 내부 오류가 발생했습니다.');
  }
};
