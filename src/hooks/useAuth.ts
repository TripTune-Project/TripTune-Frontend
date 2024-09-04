import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const useAuth = (setEncryptedCookie, resetPlaces) => {
  const router = useRouter();
  
  const checkAuthStatus = async () => {
    const accessToken = Cookies.get('trip-tune_at');
    const refreshToken = Cookies.get('trip-tune_rt');
    
    const isTokenExpired = (token) => {
      try {
        const [, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        return decoded.exp * 1000 < Date.now();
      } catch (error) {
        return true;
      }
    };
    
    if (!accessToken || isTokenExpired(accessToken)) {
      if (refreshToken) {
        try {
          await refreshAccessToken();
        } catch (error) {
          showLoginModal();
          resetPlaces();
        }
      } else {
        showLoginModal();
        resetPlaces();
      }
    }
  };
  
  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get('trip-tune_rt');
    try {
      const response = await fetch('/api/members/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('토큰 갱신 실패');
      }
      
      const data = await response.json();
      setEncryptedCookie('trip-tune_at', data.data.accessToken, 5 / (24 * 60));
   
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      throw error;
    }
  };
  
  const showLoginModal = () => {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  };
  
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  return { checkAuthStatus };
};

export default useAuth;
