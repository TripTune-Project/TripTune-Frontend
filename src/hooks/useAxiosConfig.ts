import { useEffect } from 'react';
import { AxiosInstance } from 'axios';

const useAxiosConfig = (axiosInstance: AxiosInstance) => {
  useEffect(() => {
    const setAxiosInterceptors = (instance: AxiosInstance) => {
      instance.interceptors.request.use(
        (config) => {
          // 요청 인터셉터는 필요에 따라 추가 로직 구현
          return config;
        },
        (error) => {
          // 요청 에러 처리
          return Promise.reject(error);
        }
      );
      
      instance.interceptors.response.use(
        (response) => {
          // 응답 데이터를 그대로 반환
          return response;
        },
        async (error) => {
          const originalRequest = error.config;
          if (error.response.status === 401 && !originalRequest._retry) {
            // _retry 플래그를 설정하여 무한 재시도 방지
            originalRequest._retry = true;
            try {
              // `/api/members/refresh` 엔드포인트로 리프레시 토큰 갱신 요청
              const { data } = await instance.post('/api/members/refresh');
              // 새로운 토큰을 저장하고 요청 헤더에 설정
              instance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
              // 실패했던 요청을 새 토큰으로 재시도
              return instance(originalRequest);
            } catch (refreshError) {
              // 리프레시 토큰 갱신 실패 처리
              return Promise.reject(refreshError);
            }
          }
          // 다른 상태 코드에 대한 에러 처리
          return Promise.reject(error);
        }
      );
    };
    
    setAxiosInterceptors(axiosInstance);
  }, [axiosInstance]);
};

export default useAxiosConfig;
