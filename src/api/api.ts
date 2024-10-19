import Cookies from 'js-cookie';
import { refreshApi } from './refreshApi';
import { redirect } from 'next/navigation';
import saveLocalContent from '@/utils/saveLocalContent';

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_PROXY}`;

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

const fetchOptions: RequestInit = {
  headers: DEFAULT_HEADERS,
  redirect: 'follow',
  cache: 'no-cache',
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

const handleTokenRefresh = async (): Promise<string | null> => {
  const { setEncryptedCookie } = saveLocalContent();
  const refreshToken = Cookies.get('trip-tune_rt');
  
  if (!refreshToken) {
    redirect('/login');
    throw new Error('로그인 필요합니다.');
  }
  
  try {
    const newAccessToken = await refreshApi();
    if (newAccessToken) {
      setEncryptedCookie('trip-tune_at', newAccessToken, 5 / (24 * 60));
      return newAccessToken;
    }
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
  }
  
  redirect('/login');
  throw new Error('토큰 갱신 실패');
};

const fetchData = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  
  let headers: HeadersInit = {
    ...DEFAULT_HEADERS,
    ...options.headers,
  };
  
  if (options.requiresAuth) {
    try {
      headers = {
        ...headers,
        ...getAuthHeaders(),
      };
    } catch (error) {
      const newAccessToken = await handleTokenRefresh();
      if (newAccessToken) {
        headers = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
      }
    }
  }
  
  const requestConfig: FetchOptions & { url: string } = {
    ...fetchOptions,
    ...options,
    headers,
    url,
  };
  
  let response = await fetch(url, requestConfig);
  
  if (response.status === 401 && options.requiresAuth) {
    try {
      const newAccessToken = await handleTokenRefresh();
      headers = {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      requestConfig.headers = headers;
      response = await fetch(url, requestConfig);
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      redirect('/login');
      throw new Error('토큰 갱신 실패');
    }
  }
  
  if (!response.ok) {
    const errorMessage = await parseErrorMessage(response);
    throw new Error(`API 요청 실패: ${errorMessage}`);
  }
  
  return response.json();
};

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json();
    return errorData.message || '알 수 없는 오류';
  } catch {
    return '알 수 없는 오류';
  }
};

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
