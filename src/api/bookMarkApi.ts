import { remove, post } from './api';

interface BookMarkData {
  placeId: number;
}

// 북마크 등록
export const BookMarkApi = async (data: BookMarkData) => {
  try {
    const response = await post<{ data: { placeId: number } }>(
      '/bookmarks',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        requiresAuth: true,
      }
    );

    if (response.data) {
      console.log('북마크 등록 성공:', response.data);
      return response.data;
    } else {
      throw new Error('북마크 등록에 실패했습니다.');
    }
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : '북마크 등록 중 오류가 발생했습니다.'
    );
  }
};

// 북마크 등록 해제
export const BookMarkDeleteApi = async (data: BookMarkData) => {
  try {
    const response = await remove<{ data: { placeId: number } }>(
      '/bookmarks',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        requiresAuth: true,
      }
    );

    if (response.data) {
      console.log('북마크 해제 성공:', response.data);
      return response.data;
    } else {
      throw new Error('북마크 해제에 실패했습니다.');
    }
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : '북마크 해제 중 오류가 발생했습니다.'
    );
  }
};
