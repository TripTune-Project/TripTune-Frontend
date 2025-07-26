'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Snackbar, Alert } from '@mui/material';
import styles from '@/styles/Login.module.css';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';
import VerificationLoading from '@/components/Common/VerificationLoading';
import { validatePassword } from '@/utils/validation';
import DataLoading from '@/components/Common/DataLoading';
import { AlertColor } from '@mui/material/Alert';
import Cookies from 'js-cookie';

interface IFormInput {
  password: string;
  rePassword: string;
}

const ChangePassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordToken = searchParams?.get('passwordToken');
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<IFormInput>({ mode: 'onChange' });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
  const [loading, setLoading] = useState(false);
  const password = watch('password', '');
  const rePassword = watch('rePassword', '');

  useEffect(() => {
    if (!passwordToken) {
      console.error('passwordToken을 찾을 수 없습니다.');
    }
  }, [passwordToken]);

  useEffect(() => {
    if (rePassword) {
      trigger('rePassword');
    }
  }, [password, rePassword, trigger]);

  const validateRePassword = (value: string) =>
    value === password || '비밀번호가 일치하지 않습니다.';

  const onSubmit = async (data: IFormInput) => {
    if (!passwordToken) {
      setAlertMessage('유효하지 않은 토큰입니다.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    if (data.password !== data.rePassword) {
      setAlertMessage('비밀번호가 일치하지 않습니다.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await fetch(
        'https://www.triptune.site/api/members/reset-password',
        {
          method: 'PATCH',
          body: JSON.stringify({
            passwordToken,
            password: data.password,
            rePassword: data.rePassword,
          }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const resData = await response.json();
      if (resData.success) {
        setAlertMessage('비밀번호가 성공적으로 변경되었습니다.');
        setAlertSeverity('success');
        setAlertOpen(true);
        setTimeout(() => {
          router.push('/Login');
        }, 1500);
      } else {
        setAlertMessage('비밀번호 변경에 실패했습니다.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('에러 발생:', error);
      setAlertMessage('비밀번호 변경에 실패했습니다.');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password | TripTune</title>
        <meta
          name='description'
          content='Reset your TripTune account password securely. Follow the steps to set a new password and regain access to your account.'
        />
        <meta
          name='keywords'
          content='reset password, change password, TripTune, account security'
        />
        <meta property='og:title' content='Reset Password | TripTune' />
        <meta
          property='og:description'
          content='Reset your TripTune account password securely. Follow the steps to set a new password and regain access to your account.'
        />
        <meta property='og:image' content='/assets/Logo.png' />
        <meta
          property='og:url'
          content='https://www.triptune.site/Find/ChangePassword'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/public/assets/favicon.ico' />
      </Head>
      <div className={styles.loginBackground}>
        <div className={styles.loginContainer}>
          <div className={styles.loginTitle}>비밀번호 재설정</div>
          <div
            className={styles.inputGroup}
            style={{ borderBottom: '2px solid #76ADAC' }}
          >
            <Image
              src={triptuneIcon}
              alt='로고'
              width={31}
              height={20}
              priority
            />
            <p className={styles.textPlain}>
              &nbsp;&nbsp; 새롭게 설정할 비밀번호를 입력해 주세요.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.changePwdForm}>
              <div className={styles.inputGroup}>
                <div style={{ marginBottom: '9px' }}>새로운 비밀번호</div>
                <input
                  type='password'
                  placeholder='새로운 비밀번호 (영문 대/소문자, 숫자, 특수문자 조합 8~15자리)'
                  {...register('password', {
                    required: '비밀번호를 입력해주세요.',
                    validate: (value) =>
                      validatePassword(value) ||
                      '유효한 비밀번호 형식이 아닙니다.',
                  })}
                  className={errors.password ? styles.inputError : styles.input}
                />
                {errors.password && (
                  <p className={styles.errorText}>{errors.password.message}</p>
                )}
              </div>
              <br />
              <div style={{ marginBottom: '9px' }}>비밀번호 재입력</div>
              <div className={styles.inputGroup}>
                <input
                  type='password'
                  placeholder='비밀번호 재입력'
                  {...register('rePassword', {
                    required: '비밀번호 재입력을 해주세요.',
                    validate: validateRePassword,
                  })}
                  className={
                    errors.rePassword ? styles.inputError : styles.input
                  }
                />
                {errors.rePassword && (
                  <p className={styles.errorText}>
                    {errors.rePassword.message}
                  </p>
                )}
              </div>
              <div style={{ paddingBottom: '150px' }} />
            </div>
            <button
              type='submit'
              className={styles.submitButton}
              disabled={!isValid || loading}
            >
              {loading ? <VerificationLoading /> : '비밀번호 변경'}
            </button>
          </form>
          <Snackbar
            open={alertOpen}
            autoHideDuration={3000}
            onClose={() => setAlertOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Alert
              onClose={() => setAlertOpen(false)}
              severity={alertSeverity}
              sx={{ width: '100%' }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </>
  );
};

const ChangePasswordPage = () => (
  <Suspense fallback={<DataLoading />}>
    <ChangePassword />
  </Suspense>
);

export default ChangePasswordPage;
