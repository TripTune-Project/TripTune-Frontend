'use client';

import { useEffect } from 'react';
import JoinForm from '../../components/Join/JoinForm';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  
  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = Cookies.get('trip-tune_at');
      const refreshToken = Cookies.get('trip-tune_rt');
      
      if (accessToken && refreshToken) {
        router.push('/');
      }
    };
    
    checkAuthStatus();
  }, [router]);
  
  return <JoinForm />;
}
