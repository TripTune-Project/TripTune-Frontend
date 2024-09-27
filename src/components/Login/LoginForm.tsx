'use client';

import React, { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { validatePassword, validateUserId } from '@/utils/validation';
import styles from '../../styles/Login.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Image from 'next/image';
import kakao from '../../../public/assets/icon/ic_kakao_vector.png';
import naver from '../../../public/assets/icon/ic_naver_vector.png';
import VerificationLoading from '../Common/VerificationLoading';
import { loginUser } from '@/api/loginApi';

interface LoginFormData {
  userId: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
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
      await loginUser(data);
      router.push(next);
    } catch (error) {
      console.error('로그인 에러:', error);
      setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.');
      setOpenSnackbar(true);
    }
  };

  const handleKakaoLogin = () => {
    window.location.href =
      'https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code';
  };

  const handleNaverLogin = () => {
    window.location.href =
      'https://nid.naver.com/oauth2.0/authorize?client_id=YOUR_NAVER_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code';
  };

  const handleFindId = () => {
    window.open('/Find?tab=findId', 'FindId', 'width=619,height=673');
  };

  const handleFindPassword = () => {
    window.open(
      '/Find?tab=findPassword',
      'FindPassword',
      'width=619,height=673'
    );
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Suspense fallback={<VerificationLoading />}>
      <div className={styles.loginBackground}>
        <div className={styles.loginContainer}>
          <div className={styles.loginTitle}>로그인</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputGroup}>
              <input
                placeholder='아이디'
                {...register('userId', {
                  required: '아이디를 입력해주세요.',
                  validate: validateUserId,
                })}
                className={errors.userId ? styles.inputError : styles.input}
              />
              {errors.userId && (
                <p className={styles.errorText}>{errors.userId.message}</p>
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
            <span className={styles.findId} onClick={handleFindId}>
              아이디 찾기
            </span>{' '}
            {' | '}
            <span className={styles.findPassword} onClick={handleFindPassword}>
              비밀번호 찾기
            </span>{' '}
            {' | '}
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
