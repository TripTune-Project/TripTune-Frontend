import { refreshApi } from './Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';
import Cookies from 'js-cookie';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
  requiresAuth?: boolean;
}

const clearCookies = () => {
  Cookies.remove('trip-tune_at');
  Cookies.remove('refreshToken');
  Cookies.remove('nickname');
};

const getAuthHeaders = (): HeadersInit => {
  const { getDecryptedCookie } = saveLocalContent();
  const accessToken = getDecryptedCookie('trip-tune_at');

  if (!accessToken) {
    throw new Error('액세스 토큰이 없습니다. 다시 로그인 해주세요.');
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

let isRetrying = false;
let isRedirectingToLogin = false;

const handleRedirectToLogin = (message: string, silent = false) => {
  if (isRedirectingToLogin || window.location.pathname === '/Login') return;
  
  isRedirectingToLogin = true;
  const currentPath = window.location.pathname;
  localStorage.setItem('redirectAfterLogin', currentPath);

  if (!silent) {
    alert(message);
  }

  clearCookies();
  window.location.href = '/Login';
};

const fetchData = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  if (isRedirectingToLogin) {
    return Promise.reject('리다이렉션 중');
  }

  const url = `https://triptune.site${endpoint}`;
  let headers: HeadersInit = {
    ...DEFAULT_HEADERS,
    ...options.headers,
  };

  if (options.requiresAuth) {
    try {
      headers = { ...headers, ...getAuthHeaders() };
    } catch {
      const { getDecryptedCookie } = saveLocalContent();
      const refreshToken = getDecryptedCookie('refreshToken');
      if (!refreshToken) {
        handleRedirectToLogin('인증 정보가 없습니다. 다시 로그인 해주세요.', true);
        return Promise.reject('인증 실패');
      }
      try {
        const newAccessToken = await refreshApi();
        headers = { ...headers, Authorization: `Bearer ${newAccessToken}` };
      } catch {
        handleRedirectToLogin(
          '액세스 토큰이 만료되었습니다. 다시 로그인 해주세요.',
          true
        );
        return Promise.reject('인증 실패');
      }
    }
  }

  const requestConfig: FetchOptions = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response = await fetch(url, requestConfig);

  if (!response.ok) {
    try {
      const errorData = await response.json();

      if (response.status === 401 && !isRetrying) {
        isRetrying = true;
        try {
          const { getDecryptedCookie } = saveLocalContent();
          const refreshToken = getDecryptedCookie('refreshToken');
          if (!refreshToken) {
            handleRedirectToLogin('인증 정보가 만료 되었습니다.', true);
            return undefined as unknown as T;
          }
          const newAccessToken = await refreshApi();
          headers = { ...headers, Authorization: `Bearer ${newAccessToken}` };
          const retryResponse = await fetch(url, {
            ...requestConfig,
            headers,
          });

          if (!retryResponse.ok) {
            throw new Error('재시도 실패');
          }

          isRetrying = false;
          return retryResponse.json();
        } catch {
          handleRedirectToLogin('인증 정보가 만료 되었습니다.', true);
          return undefined as unknown as T;
        }
      }

      if (errorData.message === '해당 일정에 접근 권한이 없는 사용자 입니다.') {
        window.history.back();
        throw new Error(errorData.message);
      } else if (errorData.message !== undefined) {
        throw new Error(errorData.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
    return undefined as unknown as T;
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
