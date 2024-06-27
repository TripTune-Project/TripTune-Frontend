// hooks/useAxiosConfig.ts
import { useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';

const useAxiosConfig = (axiosInstance: AxiosInstance) => {
  useEffect(() => {
    const setAxiosInterceptors = (instance: AxiosInstance) => {
      instance.interceptors.request.use(
        (config) => {
          // 요청 인터셉터 로직
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      
      instance.interceptors.response.use(
        (response) => {
          // 응답 인터셉터 로직
          return response;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    };
    
    setAxiosInterceptors(axiosInstance);
  }, [axiosInstance]);
};

export default useAxiosConfig;
