import React, { ReactNode } from 'react';
import axios from 'axios';
import useAxiosConfig from '../hooks/useAxiosConfig';

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 5000,
});

// 커스텀 훅을 사용하는 리액트 컴포넌트 또는 훅 내에서 설정
interface AxiosProviderProps {
  children: ReactNode;
}

export const AxiosProvider = ({ children }: AxiosProviderProps) => {
  useAxiosConfig(axiosInstance);
  
  return {children};
};

export default axiosInstance;
