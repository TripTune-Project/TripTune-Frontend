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
      
      try {
        const accessToken = Cookies.get('trip-tune_at');
        const refreshToken = Cookies.get('trip-tune_rt');
        
        if (accessToken && refreshToken) {
          const response = await axios.post('/api/members/refresh', {
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
          
          const newToken = response.data.accessToken;
          Cookies.set('trip-tune_at', newToken);
          
          if (error.config) {
            const headers: AxiosRequestHeaders = error.config.headers || {};
            headers['Authorization'] = `Bearer ${newToken}`;
            error.config.headers = headers;
            
            return axiosInstance(error.config);
          } else {
            console.error('에러의 config가 정의되지 않았습니다.');
          }
        } else {
          console.error('필요한 토큰이 없습니다.');
        }
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('showLoginModal');
          window.dispatchEvent(event);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
