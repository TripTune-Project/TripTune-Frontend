import { authDelete, authPost } from '@/api/authFetch';

interface BookMarkData {
  placeId: number;
}

// 북마크 등록
export const BookMarkApi = async (data: BookMarkData) => {
  try {
    return await authPost<{ data: { placeId: number } }>('/bookmarks', data);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '북마크 등록 실패'
    );
  }
};

// 북마크 등록 해제
export const BookMarkDeleteApi = async (data: BookMarkData) => {
  try {
    return await authDelete<{ data: { placeId: number } }>('/bookmarks', {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '북마크 등록 해제 실패'
    );
  }
};
