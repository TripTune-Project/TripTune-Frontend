import { post, remove } from './api';

interface BookMarkData {
  placeId: number;
}

export const BookMarkApi = async (data: BookMarkData) => {
  try {
    return await post<{ data: { placeId: number } }>(
      '/bookmarks',
      data
    );
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '북마크 등록 실패');
  }
};

export const BookMarkDeleteApi = async (data: BookMarkData) => {
  try {
    return await remove<{ data: { placeId: number } }>('/bookmarks', {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '북마크 등록 해제 실패');
  }
};
