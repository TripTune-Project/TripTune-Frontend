import { useEffect, useRef } from 'react';
import { refreshApi } from '@/apis/Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';

const useAuth = () => {
  const isRefreshing = useRef(false);
  
  // 로그인 모달을 표시하는 함수
  const showLoginModal = () => {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  };
  
  // 사용자 인증 상태를 확인하는 함수
  const checkAuthStatus = async () => {
    const { getDecryptedCookie } = saveLocalContent();
    const accessToken = getDecryptedCookie('trip-tune_at');
    const refreshToken = getDecryptedCookie('trip-tune_rt');
    
    // 액세스 토큰이 없는 경우 처리
    if (!accessToken) {
      if (refreshToken && !isRefreshing.current) {
        isRefreshing.current = true;
        try {
          await refreshApi(); // 토큰 새로고침 API 호출
        } catch {
          showLoginModal(); // 새로고침 실패 시 로그인 모달 표시
        } finally {
          isRefreshing.current = false;
        }
      } else if (!refreshToken) {
        showLoginModal(); // 리프레시 토큰도 없는 경우 로그인 모달 표시
      }
    }
  };
  
  // 컴포넌트가 마운트될 때 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // 인증 상태 확인 함수를 반환
  return { checkAuthStatus };
};

export default useAuth;
