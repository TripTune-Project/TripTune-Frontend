'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import LoginForm from '@/components/Feature/Login/LoginForm';
import { useRouter } from 'next/navigation';
import VerificationLoading from '@/components/Common/VerificationLoading';
import useAuth from '@/hooks/useAuth';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setOpenSnackbar(true);
      setTimeout(() => {
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      }, 1500);
    }
  }, [isLoading, isAuthenticated, router]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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

      {isLoading ? <VerificationLoading /> : <LoginForm />}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='info'
          sx={{ width: '100%' }}
        >
          이미 로그인되어 있습니다. 메인 페이지로 이동합니다.
        </Alert>
      </Snackbar>
    </>
  );
}
