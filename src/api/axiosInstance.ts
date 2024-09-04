import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import useSaveLocalContent from '@/utils/saveLocalContent';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
const failedQueue: { resolve: (token: string) => void; reject: (error: AxiosError) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue.length = 0;
};

const triggerLoginModal = () => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  }
};

const setAuthorizationHeader = (config: InternalAxiosRequestConfig, token: string) => {
  if (config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
};

const refreshAccessToken = async (): Promise<string> => {
  const { setEncryptedCookie } = useSaveLocalContent();
  const refreshToken = Cookies.get('trip-tune_rt');
  if (!refreshToken) throw new Error('Refresh token not available');
  
  const response = await axios.post('/api/members/refresh', { refreshToken });
  const newAccessToken = response.data.accessToken;
  setEncryptedCookie('trip-tune_at', newAccessToken, 5 / (24 * 60));
  return newAccessToken;
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('trip-tune_at');
    if (token) {
      setAuthorizationHeader(config, token);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (!Cookies.get('trip-tune_rt')) {
        triggerLoginModal();
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            setAuthorizationHeader(originalRequest, token);
            return axiosInstance(originalRequest);
          })
          .catch((queueError) => Promise.reject(queueError));
      }
      
      isRefreshing = true;
      
      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);
        setAuthorizationHeader(originalRequest, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        triggerLoginModal();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  },
);

export default axiosInstance;
