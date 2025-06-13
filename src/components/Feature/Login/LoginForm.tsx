'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { validatePassword, validateEmail } from '@/utils/validation';
import styles from '@/styles/Login.module.css';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Image from 'next/image';
import kakao from '../../../../public/assets/icons/ic_kakao_vector.png';
import naver from '../../../../public/assets/icons/ic_naver_vector.png';
import VerificationLoading from '@/components/Common/VerificationLoading';
import { loginUser } from '@/apis/Login/loginApi';
import useAuth from '@/hooks/useAuth';
import saveLocalContent from '@/utils/saveLocalContent';
import Cookies from 'js-cookie';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { setEncryptedCookie } = saveLocalContent();
  const { updateAuthStatus } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data);
      const { accessToken, nickname } = response.data;
     
      setEncryptedCookie('accessToken', accessToken);
      setEncryptedCookie('nickname', nickname);

      updateAuthStatus(true);

      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    } catch (error: any) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
      console.error('로그인 에러:', error);
    }
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleKakaoLogin = () => {
    router.push('https://www.triptune.site/oauth2/authorization/kakao');
  };

  const handleNaverLogin = () => {
    router.push('https://www.triptune.site/oauth2/authorization/naver');
  };

  const handleFindPassword = () => {
    router.push('/Find');
  };

  return (
    <Suspense fallback={<VerificationLoading />}>
      <div className={styles.loginBackground}>
        <div className={styles.loginContainer}>
          <div className={styles.loginTitle}>로그인</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputGroup}>
              <input
                placeholder='이메일'
                {...register('email', {
                  required: '이메일를 입력해주세요.',
                  validate: validateEmail,
                })}
                className={errors.email ? styles.inputError : styles.input}
              />
              {errors.email && (
                <p className={styles.errorText}>{errors.email.message}</p>
              )}
            </div>
            <div className={styles.inputGroup}>
              <input
                type='password'
                placeholder='비밀번호'
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                  validate: validatePassword,
                })}
                className={errors.password ? styles.inputError : styles.input}
              />
              {errors.password && (
                <p className={styles.errorText}>{errors.password.message}</p>
              )}
            </div>

            <button
              type='submit'
              className={styles.submitButton}
              disabled={!isValid}
            >
              로그인하기
            </button>
          </form>

          <div className={styles.linkContainer}>
            <span className={styles.findPassword} onClick={handleFindPassword}>
              비밀번호 찾기
            </span>{' '}
            |{' '}
            <span className={styles.join} onClick={() => router.push('/Join')}>
              회원가입
            </span>
          </div>

          <div className={styles.socialLoginContainer}>
            <div className={styles.hrContainer}>
              <hr className={styles.hrStyle} />
              <span className={styles.hrText}>간편 로그인</span>
              <hr className={styles.hrStyle} />
            </div>
            <button onClick={handleKakaoLogin} className={styles.kakaoButton}>
              <Image
                src={kakao}
                alt={'kakao 로그인'}
                width={21}
                height={21}
                priority
              />
              카카오로 시작하기
            </button>
            <button onClick={handleNaverLogin} className={styles.naverButton}>
              <Image src={naver} alt={'naver 로그인'} width={21} height={21} />
              네이버로 시작하기
            </button>
          </div>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={closeSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Alert
              onClose={closeSnackbar}
              severity='error'
              sx={{ width: '100%' }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </Suspense>
  );
};

export default LoginForm;
