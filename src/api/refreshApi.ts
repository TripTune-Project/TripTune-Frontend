import { post } from './api';
import Cookies from 'js-cookie';

export const refreshApi = async (): Promise<string | null> => {
  const refreshToken = Cookies.get('trip-tune_rt');

  if (!refreshToken && window.location.pathname !== '/Login') {
    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    console.error('리프레시 토큰이 존재하지 않습니다.');
    window.location.href = '/Login';
    return Promise.reject(
      '리프레시 토큰이 없습니다. 로그인 페이지로 이동합니다.'
    );
  }

  try {
    const response = await post<{ data: { accessToken: string } }>(
      '/members/refresh',
      { refreshToken }
    );
    const newAccessToken = response.data.accessToken;
    Cookies.set('trip-tune_at', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('액세스 토큰 갱신 에러:', error);

    if (error instanceof Response) {
      // error가 Response 객체인 경우 처리
      if (
        window.location.pathname !== '/Login' &&
        [400, 401, 403, 404].includes(error.status)
      ) {
        alert('토큰 갱신에 실패했습니다. 다시 로그인해주세요.');
        window.location.href = '/Login';
        return Promise.reject(
          `토큰 갱신 실패: ${error.status}, 로그인 페이지로 이동합니다.`
        );
      }
    } else {
      console.error('알 수 없는 에러:', error);
    }

    throw new Error('액세스 토큰 갱신에 실패했습니다.');
  }
};
