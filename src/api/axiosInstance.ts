import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('trip-tune_at');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const accessToken = Cookies.get('trip-tune_at');
      const refreshToken = Cookies.get('trip-tune_rt');
      
      if (accessToken && refreshToken) {
        try {
          const { data } = await axios.post('/api/members/refresh', {
            accessToken,
            refreshToken,
          });
          
          Cookies.set('trip-tune_at', data.accessToken, { expires: 5 / (24 * 60) });
          Cookies.set('trip-tune_rt', data.refreshToken, { expires: 7 });
          
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('showLoginModal'));
          }
        }
      } else {
        console.error('필요한 토큰이 없습니다.');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showLoginModal'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
