import { ReactNode } from 'react';
import axios from 'axios';
import useAxiosConfig from '../hooks/useAxiosConfig';

const axiosInstance = axios.create({
  baseURL: 'http://13.209.177.247:8080/:path*',
  timeout: 5000,
});

interface AxiosProviderProps {
  children: ReactNode;
}

export const AxiosProvider = ({ children }: AxiosProviderProps) => {
  useAxiosConfig(axiosInstance);
  
  return {children};
};

export default axiosInstance;
