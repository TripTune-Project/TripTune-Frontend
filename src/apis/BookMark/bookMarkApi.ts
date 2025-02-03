import { post, remove } from '../api';

// 북마크 등록
export const BookMarkApi = async (placeId: { placeId: number }) => {
  const url = '/api/bookmarks';
  return await post(url, placeId, {
    requiresAuth: true,
  });
};

// 북마크 등록 해제
export const BookMarkDeleteApi = async ({ placeId }: { placeId: number }) => {
  const url = `/api/bookmarks/${placeId}`;
  return await remove(url, {
    requiresAuth: true,
  });
};
