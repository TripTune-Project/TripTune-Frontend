'use client';

import { useEffect, Suspense } from 'react';
import LoginForm from '../../components/Login/LoginForm';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import VerificationLoading from '../../components/Common/VerificationLoading';

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
  
  return (
    <Suspense fallback={<VerificationLoading />}>
      <LoginForm />
    </Suspense>
  );
}
