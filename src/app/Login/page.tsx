'use client';

import { useEffect, Suspense } from 'react';
import Head from 'next/head';
import LoginForm from '@/components/Feature/Login/LoginForm';
import { useRouter } from 'next/navigation';
import VerificationLoading from '@/components/Common/VerificationLoading';
import saveLocalContent from '@/utils/saveLocalContent';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const { getDecryptedCookie } = saveLocalContent();
    const accessToken = getDecryptedCookie('trip-tune_at');
    const refreshToken = getDecryptedCookie('trip-tune_rt');

    if (accessToken && refreshToken) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'; // 이전 경로 또는 홈
      localStorage.removeItem('redirectAfterLogin'); // 사용 후 제거
      router.push(redirectPath);
    }
  }, [router]);

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
      <Suspense fallback={<VerificationLoading />}>
        <LoginForm />
      </Suspense>
    </>
  );
}
