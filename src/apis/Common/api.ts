import Cookies from 'js-cookie';
import { refreshApi } from '../Login/refreshApi';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
  requiresAuth?: boolean;
}

const getAuthHeaders = (): HeadersInit => {
  const accessToken = Cookies.get('trip-tune_at');
  if (!accessToken) {
    throw new Error('액세스 토큰이 없습니다. 다시 로그인 해주세요.');
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

let isRetrying = false;
let isRedirectingToLogin = false;

const handleTokenRefresh = async (): Promise<string | null> => {
  if (window.location.pathname === '/Login') {
    return null;
  }
  return refreshApi();
};

const handleRedirectToLogin = (message: string) => {
  if (!isRedirectingToLogin && window.location.pathname !== '/Login') {
    isRedirectingToLogin = true;
    alert(message);
    Cookies.remove('trip-tune_at');
    Cookies.remove('trip-tune_rt');
    Cookies.remove('nickname');
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
      handleRedirectToLogin('액세스 토큰이 없습니다. 다시 로그인 해주세요.');
    }
  }
  
  const requestConfig: FetchOptions = {
    ...options,
    headers,
    credentials: 'include'
  };
  
  let response = await fetch(url, requestConfig);

  if (response.status === 401) {
    if (!isRetrying) {
      isRetrying = true;
      const newAccessToken = await handleTokenRefresh();
      if (newAccessToken) {
        headers = { ...headers, Authorization: `Bearer ${newAccessToken}` };
        response = await fetch(url, { ...requestConfig, headers });
      } else {
        handleRedirectToLogin(
          '토큰 갱신에 실패했습니다. 다시 로그인 해주세요.'
        );
      }
    } else {
      handleRedirectToLogin(
        '토큰 갱신 시도 후에도 실패했습니다. 다시 로그인 해주세요.'
      );
    }
  }

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.statusText}`);
  }

  isRetrying = false;
  return response.json();
};

export const get = <T>(endpoint: string, options?: FetchOptions) =>
  fetchData<T>(endpoint, { method: 'GET', ...options });

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
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
