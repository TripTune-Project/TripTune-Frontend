import { useState, useEffect } from 'react';
import { refreshApi } from '@/apis/Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getDecryptedCookie } = saveLocalContent();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getDecryptedCookie('trip-tune_at');
      const refreshToken = getDecryptedCookie('trip-tune_rt');

      if (!accessToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        if (!refreshToken) {
          const newAccessToken = await refreshApi();
          if (!newAccessToken) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
};

export default useAuth;
