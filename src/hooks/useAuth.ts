import { useEffect, useRef } from 'react';
import { refreshApi } from '@/apis/Login/refreshApi';
import saveLocalContent from '@/utils/saveLocalContent';

const useAuth = () => {
  const isRefreshing = useRef(false);

  const isTokenExpired = (token: string) => {
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  const showLoginModal = () => {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  };

  const checkAuthStatus = async () => {
    const { getDecryptedCookie } = saveLocalContent();
    const accessToken = getDecryptedCookie('trip-tune_at');
    const refreshToken = getDecryptedCookie('trip-tune_rt');

    if (!accessToken || isTokenExpired(accessToken)) {
      if (refreshToken && !isRefreshing.current) {
        isRefreshing.current = true;
        try {
          await refreshApi();
        } catch {
          showLoginModal();
        } finally {
          isRefreshing.current = false;
        }
      } else if (!refreshToken) {
        showLoginModal();
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return { checkAuthStatus };
};

export default useAuth;
