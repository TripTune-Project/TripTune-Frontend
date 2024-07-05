import { useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';

const useAxiosConfig = (axiosInstance: AxiosInstance) => {
  useEffect(() => {
    const setAxiosInterceptors = (instance: AxiosInstance) => {
      instance.interceptors.request.use(
        (config) => {
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
        (error) => {
          return Promise.reject(error);
        }
      );
    };
    
    setAxiosInterceptors(axiosInstance);
  }, [axiosInstance]);
};

export default useAxiosConfig;
