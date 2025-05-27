import { useState, useEffect, useCallback } from 'react';
import { refreshApi } from '@/apis/Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';
import Cookies from 'js-cookie';

/**
 * useAuth 훅 - 인증 상태 관리를 위한 커스텀 훅
 *
 * 주요 기능:
 * - 사용자 인증 상태 확인 및 관리
 * - 토큰 자동 갱신
 * - 사용자 닉네임 관리
 *
 * @returns 인증 관련 상태 및 함수들
 */
const useAuth = () => {
  // 인증 상태 (null: 로딩 중, true: 인증됨, false: 인증되지 않음)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // 사용자 닉네임 상태
  const [nickname, setNickname] = useState<string>('');
  // 쿠키 관련 유틸리티 함수
  const { getDecryptedCookie } = saveLocalContent();

  /**
   * 인증 상태를 확인하는 함수
   * 1. 액세스 토큰 확인
   * 2. 액세스 토큰이 없으면 리프레시 토큰으로 갱신 시도
   * 3. 인증 상태 및 닉네임 업데이트
   */
  const checkAuth = useCallback(async () => {
    try {
      const accessToken = Cookies.get('accessToken');
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

  /**
   * 로그인/로그아웃 시 인증 상태를 수동으로 업데이트하는 함수
   *
   * @param status 업데이트할 인증 상태 (true: 인증됨, false: 인증되지 않음)
   */
  const updateAuthStatus = (status: boolean) => {
    setIsAuthenticated(status);
    if (status) {
      const storedNickname = getDecryptedCookie('nickname');
      setNickname(storedNickname || '');
    } else {
      setNickname('');
    }
  };

  /**
   * 토큰 갱신 함수
   * 리프레시 토큰을 사용하여 액세스 토큰 갱신 시도
   *
   * @returns 토큰 갱신 결과 프로미스
   */
  const handleTokenRefresh = useCallback(async () => {
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
  }, [getDecryptedCookie]);

  // 컴포넌트 마운트 시 인증 상태 확인 및 주기적 갱신 설정
  useEffect(() => {
    checkAuth();
    // 4분마다 인증 상태 확인 (토큰 만료 방지)
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
