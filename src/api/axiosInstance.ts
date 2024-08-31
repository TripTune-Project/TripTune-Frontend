import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('trip-tune_at');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      console.error('401 Unauthorized - 토큰이 만료되었습니다.');
      
      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          const response = await axios.post('/api/members/refresh', { token: refreshToken });
          
          const newToken = response.data.accessToken;
          Cookies.set('trip-tune_at', newToken);
          
          if (error.config.headers) {
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
          }
          return axiosInstance(error.config);
        } else {
          console.error('리프레시 토큰이 없습니다. 로그아웃 처리');
          handleLogout();
        }
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        handleLogout();
      }
    }
    return Promise.reject(error);
  }
);

const handleLogout = () => {
  Cookies.remove('trip-tune_at');
  Cookies.remove('refresh_token');
  
  Router.push('/login');
};

export default axiosInstance;
