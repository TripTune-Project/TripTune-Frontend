import { useState, useEffect, useCallback } from 'react';
import { refreshApi } from '@/apis/Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const { getDecryptedCookie } = saveLocalContent();

  const checkAuth = useCallback(async () => {
    try {
      const accessToken = getDecryptedCookie('trip-tune_at');

      if (!accessToken) {
        // 액세스 토큰이 없으면 리프레시 토큰으로 갱신 시도
        try {
          await refreshApi();
          setIsAuthenticated(true);
        } catch (refreshError) {
          // 리프레시 실패 시 로그아웃 처리
          console.error('토큰 갱신 실패:', refreshError);
          setIsAuthenticated(false);
          throw new Error('토큰 갱신에 실패했습니다');
        }
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('인증 확인 실패:', error);
      setIsAuthenticated(false);
      const currentPath = window.location.pathname;
      if (currentPath !== '/Login') {
        localStorage.setItem('redirectAfterLogin', currentPath);
        router.push('/Login');
      }
    }
  }, [getDecryptedCookie, router]);

  // 로그인 성공 시 즉시 인증 상태를 업데이트하는 함수
  const updateAuthStatus = (status: boolean) => {
    setIsAuthenticated(status);
  };

  // 토큰 갱신 시 인증 상태를 업데이트하는 함수
  const handleTokenRefresh = async () => {
    try {
      await refreshApi();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
    const id = setInterval(checkAuth, 4 * 60 * 1000);
    return () => clearInterval(id);
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading: isAuthenticated === null,
    updateAuthStatus,
    handleTokenRefresh,
  };
};

export default useAuth;
