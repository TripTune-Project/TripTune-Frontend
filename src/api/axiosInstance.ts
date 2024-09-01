import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 5000,
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
        const accessToken = Cookies.get('trip-tune_at');
        const refreshToken = Cookies.get('trip-tune_rt');
        
        if (accessToken && refreshToken) {
          const response = await axios.post('/api/members/refresh', {
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
          
          const newToken = response.data.accessToken;
          Cookies.set('trip-tune_at', newToken);
          
          if (error.config.headers) {
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
          }
          return axiosInstance(error.config);
        } else {
          console.error('필요한 토큰이 없습니다.');
        }
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
