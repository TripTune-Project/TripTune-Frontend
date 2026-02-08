'use client';

import { useEffect, useState } from 'react';
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
