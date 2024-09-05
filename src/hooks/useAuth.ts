import { useEffect } from 'react';
import Cookies from 'js-cookie';

const useAuth = (
  setEncryptedCookie: (name: string, value: string, expiration: number) => void,
  resetPlaces: () => void,
) => {
  const isTokenExpired = (token: string) => {
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };
  
  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get('trip-tune_rt');
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }
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
  };
  
  const showLoginModal = () => {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  };
  
  const checkAuthStatus = async () => {
    const accessToken = Cookies.get('trip-tune_at');
    const refreshToken = Cookies.get('trip-tune_rt');
    
    if (!accessToken || isTokenExpired(accessToken)) {
      if (refreshToken) {
        try {
          await refreshAccessToken();
        } catch {
          showLoginModal();
          resetPlaces();
        }
      } else {
        showLoginModal();
        resetPlaces();
      }
    }
  };
  
  useEffect(() => {
    checkAuthStatus();
  }, [resetPlaces, setEncryptedCookie]);
  
  return { checkAuthStatus };
};

export default useAuth;
