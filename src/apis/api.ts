import Cookies from 'js-cookie';
import { refreshApi } from './Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
  requiresAuth?: boolean;
}

const clearCookies = () => {
  Cookies.remove('trip-tune_at');
  Cookies.remove('trip-tune_rt');
  Cookies.remove('nickname');
};

const getAuthHeaders = (): HeadersInit => {
  const { getDecryptedCookie } = saveLocalContent();
  const accessToken = getDecryptedCookie('trip-tune_at'); // 복호화된 토큰 가져오기

  if (!accessToken) {
    throw new Error('액세스 토큰이 없습니다. 다시 로그인 해주세요.');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

let isRetrying = false;
let isRedirectingToLogin = false;

const handleRedirectToLogin = (message: string) => {
  if (!isRedirectingToLogin && window.location.pathname !== '/Login') {
    isRedirectingToLogin = true;
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);

    alert(message);

    clearCookies();
    window.location.href = '/Login';
  }
};

const fetchData = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const url = `https://triptune.site${endpoint}`;
  let headers: HeadersInit = {
    ...DEFAULT_HEADERS,
    ...options.headers,
  };

  if (options.requiresAuth) {
    try {
      headers = { ...headers, ...getAuthHeaders() };
    } catch {
      const newAccessToken = await refreshApi();
      if (newAccessToken) {
        headers = { ...headers, Authorization: `Bearer ${newAccessToken}` };
      } else {
        handleRedirectToLogin('액세스 토큰이 없습니다. 다시 로그인 해주세요.');
        return Promise.reject('Unauthorized');
      }
    }
  }

  const requestConfig: FetchOptions = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response = await fetch(url, requestConfig);

  // 실패한 경우 서버의 에러 메시지를 처리
  if (!response.ok) {
    try {
      const errorData = await response.json();

      // 1. 유효하지 않은 JWT 토큰이면 로그인 페이지로 이동
      if (
        errorData.message ===
        '유효하지 않은 인증 정보입니다. 로그인 후 이용해주세요.'
      ) {
        clearCookies();
        handleRedirectToLogin(
          ' 인증 정보가 만료 되었습니다. '
        );
        return undefined as unknown as T;
      }

      // 2. 401 (토큰 만료) 시 갱신 시도
      if (response.status === 401) {
        if (!isRetrying) {
          isRetrying = true;
          const newAccessToken = await refreshApi();
          if (newAccessToken) {
            headers = { ...headers, Authorization: `Bearer ${newAccessToken}` };
            response = await fetch(url, { ...requestConfig, headers });

            // 새로운 요청도 실패하면 로그인 페이지로 이동
            if (!response.ok) {
              clearCookies();
              handleRedirectToLogin(
                ' 인증 정보가 만료 되었습니다. '
              );
              return undefined as unknown as T;
            }
          } else {
            clearCookies();
            handleRedirectToLogin(
              '토큰 갱신에 실패했습니다. 다시 로그인 해주세요.'
            );
            return undefined as unknown as T;
          }
        } else {
          clearCookies();
          handleRedirectToLogin(
            ' 인증 정보가 만료 되었습니다. '
          );
          return undefined as unknown as T;
        }
      }
      
      // 3. 기타 에러 메시지 처리
      alert(errorData.message);
    } catch {
      alert('서버 응답을 처리할 수 없습니다.');
    }
  }

  isRetrying = false;
  return response.json();
};

export const get = <T>(endpoint: string, options?: FetchOptions) =>
  fetchData<T>(endpoint, {
    method: 'GET',
    ...options,
  });

export const post = <T>(
  endpoint: string,
  body: object,
  options?: FetchOptions
) =>
  fetchData<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });

export const patch = <T>(
  endpoint: string,
  body: object,
  options?: FetchOptions
) =>
  fetchData<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
    ...options,
  });

export const remove = <T>(
  endpoint: string,
  body?: object,
  options?: FetchOptions
) =>
  fetchData<T>(endpoint, {
    method: 'DELETE',
    body: JSON.stringify(body),
    ...options,
  });
