import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
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
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - 토큰이 만료되었습니다.');
      
      const accessToken = Cookies.get('trip-tune_at');
      const refreshToken = Cookies.get('trip-tune_rt');
      
      if (accessToken && refreshToken) {
        try {
          const { data } = await axios.post('/api/members/refresh', {
            accessToken,
            refreshToken,
          });
          
          const newAccessToken = data.accessToken;
          Cookies.set('trip-tune_at', newAccessToken);
          
          if (error.config) {
            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance.request(error.config);
          }
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
