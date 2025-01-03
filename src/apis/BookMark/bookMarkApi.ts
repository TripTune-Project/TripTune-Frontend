import { remove, post } from '../Common/api';
import { handleApiError } from '@/apis/Common/errorHandler';

interface BookMarkData {
  placeId: number;
}

// 북마크 등록
export const BookMarkApi = async (data: BookMarkData) => {
  try {
    const response = await post<{ data: { placeId: number } }>(
      '/api/bookmarks',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        requiresAuth: true,
      },
    );
    
    if (response.data) {
      console.log('북마크 등록 성공:', response.data);
      return response.data;
    }
  } catch (error: any) {
    if (error?.status === 409) {
      return handleApiError(error, '이미 북마크된 여행지입니다.', 409);
    }
    return handleApiError(error, '북마크 등록 중 오류가 발생했습니다.');
  }
};

// 북마크 등록 해제
export const BookMarkDeleteApi = async (data: BookMarkData) => {
  
  try {
    const response = await remove<{ data: { placeId: number } }>(
      '/api/bookmarks',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        requiresAuth: true,
      },
    );
    
    if (response.data) {
      console.log('북마크 해제 성공:', response.data);
      return response.data;
    }
  } catch (error:any) {
    if (error?.status === 404) {
      return handleApiError(error, '북마크가 등록되어 있지 않습니다.', 404);
    }
    return handleApiError(error, '북마크 삭제 중 오류가 발생했습니다.');
  }
};
