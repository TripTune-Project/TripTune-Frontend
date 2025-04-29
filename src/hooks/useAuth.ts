import { useState, useEffect, useCallback } from 'react';
import { refreshApi } from '@/apis/Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const { getDecryptedCookie } = saveLocalContent();

  const checkAuth = useCallback(async () => {
    try {
      const accessToken = getDecryptedCookie('accessToken');
      const storedNickname = getDecryptedCookie('nickname');

      if (!accessToken) {
        // 액세스 토큰이 없으면 리프레시 토큰 존재 시에만 갱신 시도
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          try {
            await refreshApi();
            setIsAuthenticated(true);
            setNickname(storedNickname || '');
          } catch (refreshError) {
            // 리프레시 실패 시 인증 실패 처리
            console.error('토큰 갱신 실패:', refreshError);
            setIsAuthenticated(false);
            setNickname('');
          }
        } else {
          setIsAuthenticated(false);
          setNickname('');
        }
      } else {
        setIsAuthenticated(true);
        setNickname(storedNickname || '');
      }
    } catch (error) {
      console.error('인증 확인 실패:', error);
      setIsAuthenticated(false);
      setNickname('');
    }
  }, [getDecryptedCookie]);

  // 로그인 성공 시 즉시 인증 상태를 업데이트하는 함수
  const updateAuthStatus = (status: boolean) => {
    setIsAuthenticated(status);
    if (status) {
      const storedNickname = getDecryptedCookie('nickname');
      setNickname(storedNickname || '');
    } else {
      setNickname('');
    }
  };

  // 토큰 갱신 시 인증 상태를 업데이트하는 함수
  const handleTokenRefresh = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      setIsAuthenticated(false);
      setNickname('');
      return;
    }
    try {
      await refreshApi();
      setIsAuthenticated(true);
      const storedNickname = getDecryptedCookie('nickname');
      setNickname(storedNickname || '');
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      setIsAuthenticated(false);
      setNickname('');
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
    nickname,
  };
};

export default useAuth;
