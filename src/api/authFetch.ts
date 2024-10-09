import Cookies from 'js-cookie';
import { refreshApi } from './refreshApi';
import { redirect } from 'next/navigation';

type HeadersType = Record<string, string>;

interface FetchOptions extends RequestInit {
  headers?: HeadersType;
}

interface FailedQueueItem {
  resolve: (value: Response) => void;
  reject: (error: Error | string) => void;
}

// Authorization 헤더 설정 함수
const setAuthorizationHeader = (headers: HeadersType, token: string) => {
  headers['Authorization'] = `Bearer ${token}`;
};

// 로그인 페이지로 리다이렉트 함수
const redirectToLoginPage = () => {
  redirect('/Login');  // next/navigation의 redirect 사용
};

export const authFetch = async (
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  let isRefreshing = false;
  const failedQueue: FailedQueueItem[] = [];

  const processQueue = (
    error: Error | string | null,
    token: string | null = null
  ) => {
    failedQueue.forEach(async ({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        const updatedOptions = { ...options };
        if (updatedOptions.headers) {
          setAuthorizationHeader(updatedOptions.headers, token);
        }
        try {
          const response = await fetch(url, updatedOptions);
          resolve(response);
        } catch (fetchError) {
          reject(
            fetchError instanceof Error ? fetchError : 'Unknown error occurred'
          );
        }
      }
    });
    failedQueue.length = 0;
  };

  const fetchWithToken = async (
    url: string,
    options: FetchOptions
  ): Promise<Response> => {
    const accessToken = Cookies.get('trip-tune_at');
    const refreshToken = Cookies.get('trip-tune_rt');
    const userId = Cookies.get('user_id');  // 아이디 쿠키도 같이 확인

    // 리프레시 토큰이나 아이디 쿠키가 없으면 로그인 유도
    if (!refreshToken || !userId) {
      redirectToLoginPage();  // 로그인 페이지로 리다이렉트
      throw new Error('리프레시 토큰 또는 사용자 정보가 없습니다.');
    }

    // 액세스 토큰이 없으면 리프레시 토큰으로 갱신 시도
    if (!accessToken) {
      if (isRefreshing) {
        return new Promise<Response>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(async (newAccessToken) => {
          if (typeof newAccessToken === 'string') {
            const updatedOptions = { ...options };
            if (updatedOptions.headers) {
              setAuthorizationHeader(updatedOptions.headers, newAccessToken);
            }
            return fetch(url, updatedOptions);
          }
          throw new Error('토큰 갱신 실패');
        });
      }

      isRefreshing = true;
      try {
        const newAccessToken = await refreshApi(); // 리프레시 토큰으로 갱신
        processQueue(null, newAccessToken);
        if (options.headers) {
          setAuthorizationHeader(options.headers, newAccessToken);
        }
        return await fetch(url, options);
      } catch (error) {
        processQueue(
          error instanceof Error
            ? error.message
            : '토큰 갱신 중 문제가 발생했습니다.',
          null
        );
        redirectToLoginPage();  // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    // 액세스 토큰이 있으면 그대로 요청
    if (accessToken && options.headers) {
      setAuthorizationHeader(options.headers, accessToken);
    }

    try {
      const response = await fetch(url, options);

      // 만약 응답이 401이라면 토큰 만료 처리
      if (response.status === 401) {
        if (!refreshToken || !userId) {
          redirectToLoginPage();  // 리프레시 토큰 없을 때 로그인 페이지로 리다이렉트
          throw new Error('리프레시 토큰 또는 사용자 정보가 없습니다.');
        }

        if (isRefreshing) {
          return new Promise<Response>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        }

        isRefreshing = true;
        try {
          const newAccessToken = await refreshApi();
          processQueue(null, newAccessToken);
          if (options.headers) {
            setAuthorizationHeader(options.headers, newAccessToken);
          }
          return await fetch(url, options);
        } catch (error) {
          processQueue(
            error instanceof Error
              ? error.message
              : '토큰 갱신 중 문제가 발생했습니다.',
            null
          );
          redirectToLoginPage();  // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
          throw error;
        } finally {
          isRefreshing = false;
        }
      }

      return response;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred');
    }
  };

  options = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  return fetchWithToken(url, options);
};
