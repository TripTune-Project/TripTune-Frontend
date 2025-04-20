import { useState, useEffect } from 'react';
import { refreshApi } from '@/apis/Login/refreshApi';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const checkAuth = async () => {
    try {
      await refreshApi();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };
  
  useEffect(() => {
    checkAuth();
    const id = setInterval(checkAuth, 60_000);
    return () => clearInterval(id);
  }, []);
  
  return { isAuthenticated, isLoading: isAuthenticated === null };
};

export default useAuth;
