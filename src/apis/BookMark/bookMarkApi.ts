import { post, remove } from '../api';
import { ApiResponse } from '@/types/scheduleType';

// 1. 북마크 등록 (POST)
export const BookMarkApi = async (placeId: { placeId: number }) => {
  const url = '/api/bookmarks';
  return await post(url, placeId, {
    requiresAuth: true,
  });
};

// 2. 북마크 등록 해제 (DELETE)
export const BookMarkDeleteApi = async (
  placeId: number
): Promise<ApiResponse<null>> => {
  const url = `/api/bookmarks/${placeId}`;
  return await remove(url, undefined,  { requiresAuth: true });
};
