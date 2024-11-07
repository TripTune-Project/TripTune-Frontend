import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { refreshApi } from '@/api/refreshApi';

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
    const accessToken = Cookies.get('trip-tune_at');
    const refreshToken = Cookies.get('trip-tune_rt');
    
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
