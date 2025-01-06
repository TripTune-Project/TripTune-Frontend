import { patch } from '@/apis/Common/api';
import Cookies from 'js-cookie';
import { handleApiError } from '@/apis/Common/errorHandler';

export const logoutApi = async (): Promise<unknown> => {
  const accessToken = Cookies.get('trip-tune_at');
  const nickname = Cookies.get('nickname');

  if (accessToken) {
    try {
      await patch(
        '/api/members/logout',
        { nickname },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Cookies.remove('trip-tune_at');
      Cookies.remove('trip-tune_rt');
      Cookies.remove('nickname');
      window.location.href = '/';
    } catch (error:any) {
      return handleApiError(error, '로그아웃이 실패하였습니다.');
    }
  }
};
