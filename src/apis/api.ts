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

const handleRedirectToLogin = (message:string, silent = false) => {
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
  
  // 1) 요청 시 인증이 필요한 경우
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
      
      // 2) "유효하지 않은 인증 정보" 메시지
      if (errorData.message === '유효하지 않은 인증 정보입니다. 로그인 후 이용해주세요.') {
        clearCookies();
        handleRedirectToLogin('인증 정보가 만료 되었습니다.', true);
        return undefined as unknown as T;
      }
      
      // 3) 401 에러: 토큰 만료 -> 토큰 재발급 후 재요청
      if (response.status === 401) {
        if (!isRetrying) {
          isRetrying = true;
          const newAccessToken = await refreshApi();
          if (newAccessToken) {
            headers = { ...headers, Authorization: `Bearer ${newAccessToken}` };
            const retryResponse = await fetch(url, { ...requestConfig, headers });
            
            // 재요청도 실패하면 로그인 화면으로 이동
            if (!retryResponse.ok) {
              clearCookies();
              handleRedirectToLogin('인증 정보가 만료 되었습니다.', true);
              return undefined as unknown as T;
            }
            
            // 재요청이 성공하면 여기서 바로 반환
            isRetrying = false;
            return retryResponse.json();
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
      
      // 4) 그 외 에러
      if (errorData.message === '해당 일정에 접근 권한이 없는 사용자 입니다.') {
        window.history.back();
        throw new Error(errorData.message);
      } else if (errorData.message !== undefined) {
        throw new Error(errorData.message);
      }
    } catch(error: any) {
      throw new Error(error.message);
    }
    // 에러가 있는 경우 반환값이 없으므로 함수 종료
    return undefined as unknown as T;
  }
  
  // 요청이 정상이라면 응답 반환
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
