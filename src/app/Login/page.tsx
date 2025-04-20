'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import LoginForm from '@/components/Feature/Login/LoginForm';
import { useRouter } from 'next/navigation';
import VerificationLoading from '@/components/Common/VerificationLoading';
import useAuth from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    }
  }, [isLoading, isAuthenticated, router]);
  
  return (
    <>
      <Head>
        <title>Login | TripTune</title>
        <meta
          name='description'
          content='Log in to TripTune to manage your travel plans and explore top destinations.'
        />
        <meta
          name='keywords'
          content='login, TripTune, travel planning, access account'
        />
        <meta property='og:title' content='Login | TripTune' />
        <meta
          property='og:description'
          content='Log in to TripTune to manage your travel plans and explore top destinations.'
        />
        <meta property='og:image' content='/assets/Logo.png' />
        <meta property='og:url' content='https://www.triptune.site/Login' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      
      {isLoading ? (
        <VerificationLoading />
      ) : (
        <LoginForm />
      )}
    </>
  );
}
