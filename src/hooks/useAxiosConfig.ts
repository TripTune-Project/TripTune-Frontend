import { useEffect, useRef } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const setAxiosInterceptors = (instance: AxiosInstance, navigate: NavigateFunction) => {
  instance.interceptors.request.use(
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
  
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const accessToken = Cookies.get('trip-tune_at');
          const refreshToken = Cookies.get('trip-tune_rt');
          const response = await instance.post('/api/members/refresh', { accessToken, refreshToken });
          const newAccessToken = response.data.accessToken;
          
          Cookies.set('trip-tune_at', newAccessToken, { expires: 7 });
          instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          navigate('/login');
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

const useAxiosConfig = (axiosInstance: AxiosInstance) => {
  const navigate = useNavigate();
  const interceptorsRegistered = useRef(false);
  
  useEffect(() => {
    if (!interceptorsRegistered.current) {
      setAxiosInterceptors(axiosInstance, navigate);
      interceptorsRegistered.current = true;
    }
  }, [axiosInstance, navigate]);
};

export default useAxiosConfig;
