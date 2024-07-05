'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { validatePassword, validateUserId } from '../../utils/validation';
import styles from '../../styles/Login.module.css';
import { useRouter } from 'next/navigation';
import useLogin from '../../hooks/useLogin';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface LoginFormData {
  userId: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { loginUser } = useLogin();
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
      router.push('/Home');
    } catch (error) {
      console.error('로그인 에러:', error);
      setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.');
      setOpenSnackbar(true);
    }
  };
  
  const handleKakaoLogin = () => {
    window.location.href = 'https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code';
  };
  
  const handleNaverLogin = () => {
    window.location.href = 'https://nid.naver.com/oauth2.0/authorize?client_id=YOUR_NAVER_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code';
  };
  
  const handleFindId = () => {
    window.open('/Find?tab=findId', 'FindId', 'width=600,height=400');
  };
  
  const handleFindPassword = () => {
    window.open('/Find?tab=findPassword', 'FindPassword', 'width=600,height=400');
  };
  
  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>LOGIN</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              placeholder="아이디"
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
              type="password"
              placeholder="비밀번호"
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
            type="submit"
            className={styles.submitButton}
            disabled={!isValid}
          >
            로그인하기
          </button>
        </form>
        {errorMessage && (
          <p className={styles.errorText}>{errorMessage}</p>
        )}
      </div>
      
      <div className={styles.socialLoginContainer}>
        <button onClick={handleKakaoLogin} className={styles.kakaoButton}>
          카카오 계정으로 로그인
        </button>
        <button onClick={handleNaverLogin} className={styles.naverButton}>
          네이버 계정으로 로그인
        </button>
      </div>
      
      <hr className={styles.hr} />
      <div className={styles.linkContainer}>
        <div className={styles.join} onClick={() => router.push('/Join')}>
          회원가입
        </div>
        <div>
          <span
            className={styles.findId}
            onClick={handleFindId}
          >
            아이디 찾기
          </span>
          <span
            className={styles.findPassword}
            onClick={handleFindPassword}
          >
            비밀번호 찾기
          </span>
        </div>
      </div>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert onClose={closeSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginForm;
