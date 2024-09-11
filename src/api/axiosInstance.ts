import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';
import { refreshApi } from '@/api/refreshApi';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
const failedQueue: {
  resolve: (token: string) => void;
  reject: (error: AxiosError<unknown>) => void;
}[] = [];

const processQueue = (
  error: AxiosError<unknown> | null,
  token: string | null = null
) => {
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

const setAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  token: string
) => {
  if (config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('trip-tune_at');
    if (token) {
      setAuthorizationHeader(config, token);
    }
    return config;
  },
  (error: AxiosError<unknown>) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    
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
          .catch((queueError: unknown) => {
            if (queueError instanceof AxiosError) {
              return Promise.reject(queueError);
            }
            return Promise.reject(new Error('Unknown error occurred in queue'));
          });
      }
      
      isRefreshing = true;
      
      try {
        const newAccessToken = await refreshApi();
        processQueue(null, newAccessToken);
        setAuthorizationHeader(originalRequest, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError: unknown) {
        if (refreshError instanceof AxiosError) {
          processQueue(refreshError, null);
          triggerLoginModal();
          return Promise.reject(refreshError);
        }
        
        processQueue(null, null);
        return Promise.reject(
          new Error('Unknown error occurred during token refresh')
        );
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
