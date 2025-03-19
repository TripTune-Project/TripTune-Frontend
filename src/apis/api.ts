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

const handleRedirectToLogin = (message: string, silent = false) => {
  if (!isRedirectingToLogin && window.location.pathname !== '/Login') {
    isRedirectingToLogin = true;
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);
    
    if (!silent) {
      alert(message);
    }
    
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
        handleRedirectToLogin('액세스 토큰이 없습니다. 다시 로그인 해주세요.', true);
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
  
  if (!response.ok) {
    try {
      const errorData = await response.json();
      
      // 인증 정보 관련 에러 처리
      if (errorData.message === '유효하지 않은 인증 정보입니다. 로그인 후 이용해주세요.') {
        clearCookies();
        handleRedirectToLogin('인증 정보가 만료 되었습니다.', true);
        return undefined as unknown as T;
      }
      
      // 401 에러: 토큰 만료 상황 처리
      if (response.status === 401) {
        if (!isRetrying) {
          isRetrying = true;
          const newAccessToken = await refreshApi();
          if (newAccessToken) {
            headers = { ...headers, Authorization: `Bearer ${newAccessToken}` };
            response = await fetch(url, { ...requestConfig, headers });
            
            if (!response.ok) {
              clearCookies();
              handleRedirectToLogin('인증 정보가 만료 되었습니다.', true);
              return undefined as unknown as T;
            }
          } else {
            clearCookies();
            handleRedirectToLogin('토큰 갱신에 실패했습니다. 다시 로그인 해주세요.', true);
            return undefined as unknown as T;
          }
        } else {
          clearCookies();
          handleRedirectToLogin('인증 정보가 만료 되었습니다.', true);
          return undefined as unknown as T;
        }
      }
      
      // 그 외 기타 에러 처리: 일정 접근 권한 없음일 경우 뒤로 가기
      if (errorData.message === '해당 일정에 접근 권한이 없는 사용자 입니다.') {
        alert(errorData.message);
        window.history.back();
      } else if (errorData.message !== undefined) {
        alert(errorData.message);
      }
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
