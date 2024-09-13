import Cookies from 'js-cookie';
import { refreshApi } from './refreshApi';

type HeadersType = Record<string, string>;

interface FetchOptions extends RequestInit {
  headers?: HeadersType;
}

interface FailedQueueItem {
  resolve: (value: Response) => void;
  reject: (error: unknown) => void;
}

const setAuthorizationHeader = (headers: HeadersType, token: string) => {
  headers['Authorization'] = `Bearer ${token}`;
};

const triggerLoginModal = () => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  }
};

const authFetch = async (
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  let isRefreshing = false;
  const failedQueue: FailedQueueItem[] = [];

  const processQueue = (error: unknown, token: string | null = null) => {
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
          reject(fetchError);
        }
      }
    });
    failedQueue.length = 0;
  };

  const fetchWithToken = async (
    url: string,
    options: FetchOptions
  ): Promise<Response> => {
    const token = Cookies.get('trip-tune_at');
    if (token && options.headers) {
      setAuthorizationHeader(options.headers, token);
    }

    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        if (!Cookies.get('trip-tune_rt')) {
          triggerLoginModal();
          alert('로그인이 필요합니다.');
          throw new Error('리프레시 토큰이 없습니다.');
        }

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
          const newAccessToken = await refreshApi();
          processQueue(null, newAccessToken);
          if (options.headers) {
            setAuthorizationHeader(options.headers, newAccessToken);
          }
          return await fetch(url, options);
        } catch (error) {
          processQueue(error, null);
          triggerLoginModal();
          alert('토큰 갱신 중 문제가 발생했습니다.');
          throw error;
        } finally {
          isRefreshing = false;
        }
      }

      return response;
    } catch (error) {
      throw error;
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

export default authFetch;
