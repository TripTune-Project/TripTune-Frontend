import { remove, post } from './api';

interface BookMarkData {
  placeId: number;
}

// 북마크 등록
export const BookMarkApi = async (data: BookMarkData) => {
  try {
    return await post<{ data: { placeId: number } }>('/bookmarks', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      requiresAuth: true, // 인증 관련 옵션을 headers 외부로 이동
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '북마크 등록 실패'
    );
  }
};

// 북마크 등록 해제
export const BookMarkDeleteApi = async (data: BookMarkData) => {
  try {
    return await remove<{ data: { placeId: number } }>('/bookmarks', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      requiresAuth: true, // 인증 관련 옵션을 headers 외부로 이동
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '북마크 등록 해제 실패'
    );
  }
};
