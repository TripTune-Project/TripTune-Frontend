// await customFetch('http://13.209.177.247:8080/api/users/me', {
//   method: 'GET',
// });
// axiosInstance 대체

import Cookies from 'js-cookie';
import { refreshApi } from './refreshApi';

const setAuthorizationHeader = (headers, token) => {
  headers['Authorization'] = `Bearer ${token}`;
};

const triggerLoginModal = () => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  }
};

const authFetch = async (url, options = {}) => {
  let isRefreshing = false;
  const failedQueue = [];
  
  const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      }
    });
    failedQueue.length = 0;
  };
  
  const fetchWithToken = async (url, options) => {
    const token = Cookies.get('trip-tune_at');
    if (token) {
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
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            setAuthorizationHeader(options.headers, token);
            return fetch(url, options);
          });
        }
        
        isRefreshing = true;
        try {
          const newAccessToken = await refreshApi();
          processQueue(null, newAccessToken);
          setAuthorizationHeader(options.headers, newAccessToken);
          return fetch(url, options);
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
