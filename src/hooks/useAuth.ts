import { useState, useEffect } from 'react';
import { refreshApi } from '@/apis/Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';

const useAuth = () => {
  // null: 아직 체크 중, true/false: 체크 완료 결과
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { getDecryptedCookie } = saveLocalContent();
  
  const checkAuth = async () => {
    try {
      // refreshToken이 없으면 바로 인증 실패 처리
      const refreshToken = getDecryptedCookie('trip-tune_rt');
      if (!refreshToken) {
        setIsAuthenticated(false);
        return;
      }
      // refreshToken이 있으므로 refreshApi를 호출해 access token 갱신 시도
      const newAccessToken = await refreshApi();
      if (!newAccessToken) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('인증 체크 중 오류 발생:', error);
      setIsAuthenticated(false);
    }
  };
  
  useEffect(() => {
    // 최초 인증 체크
    checkAuth();
    // 이후 60초마다 주기적으로 체크 (필요에 따라 간격 조정)
    const intervalId = setInterval(checkAuth, 60000);
    return () => clearInterval(intervalId);
  }, [getDecryptedCookie]);
  
  return { isAuthenticated, isLoading: isAuthenticated === null };
};

export default useAuth;
