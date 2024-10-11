import Cookies from 'js-cookie';
import { refreshApi } from './refreshApi';
import { redirect } from 'next/navigation';

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_PROXY}`;

const fetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow',
  cache: 'no-cache',
};

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
  requiresAuth?: boolean; // 인증이 필요한지 여부
}

// 토큰을 헤더에 삽입하는 함수
const getAuthHeaders = (): HeadersInit => {
  const accessToken = Cookies.get('trip-tune_at');
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

// 토큰 갱신 및 재시도 로직
const handleTokenRefresh = async (originalRequest: RequestInit): Promise<Response> => {
  const refreshToken = Cookies.get('trip-tune_rt');
  
  if (!refreshToken) {
    redirect('/login');
    throw new Error('로그인 필요');
  }
  
  const newAccessToken = await refreshApi(refreshToken);
  
  if (newAccessToken) {
    Cookies.set('trip-tune_at', newAccessToken);
    // 갱신된 토큰으로 다시 요청
    return fetch(originalRequest.url!, {
      ...originalRequest,
      headers: {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }
  
  redirect('/login');
  throw new Error('토큰 갱신 실패');
};

// 통합 fetch 함수
export const fetchData = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  
  // 인증이 필요한 경우 헤더에 토큰 추가
  const headers: HeadersInit = {
    ...fetchOptions.headers,
    ...(options.requiresAuth ? getAuthHeaders() : {}),
    ...options.headers,
  };
  
  const requestConfig: FetchOptions = {
    ...fetchOptions,
    ...options,
    headers,
  };
  
  let response = await fetch(url, requestConfig);
  
  // 401 에러 발생 시 토큰 갱신 시도
  if (response.status === 401 && options.requiresAuth) {
    response = await handleTokenRefresh(requestConfig);
  }
  
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API 요청 실패');
    } catch {
      throw new Error('API 요청 실패');
    }
  }
  
  return response.json();
};

// HTTP 메소드별 요청 함수
export const get = <T>(endpoint: string, options?: FetchOptions) => {
  return fetchData<T>(endpoint, { method: 'GET', ...options });
};

export const post = <T>(endpoint: string, body: object, options?: FetchOptions) => {
  return fetchData<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
};

export const put = <T>(endpoint: string, body: object, options?: FetchOptions) => {
  return fetchData<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  });
};

export const patch = <T>(endpoint: string, body: object, options?: FetchOptions) => {
  return fetchData<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
    ...options,
  });
};

export const remove = <T>(endpoint: string, body?: object, options?: FetchOptions) => {
  return fetchData<T>(endpoint, {
    method: 'DELETE',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
};
