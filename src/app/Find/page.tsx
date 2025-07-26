'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { requestFindPassword } from '@/apis/Login/findApi';
import VerificationLoading from '@/components/Common/VerificationLoading';
import DataLoading from '@/components/Common/DataLoading';
import styles from '@/styles/Find.module.css';
import { validateEmail } from '@/utils/validation';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor, SnackbarCloseReason } from '@mui/material';
import Image from 'next/image';
import triptuneIcon from '../../../public/assets/images/로고/triptuneIcon-removebg.png';

interface FindPasswordFormData {
  email: string;
}

function FindPage() {
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FindPasswordFormData>({
    mode: 'onChange',
  });

  const handleAlertClose = (
    event: React.SyntheticEvent<any, Event> | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  const onSubmit = async (data: FindPasswordFormData) => {
    setLoading(true);
    try {
      const response = await requestFindPassword(data.email);
      if (response.success) {
        setMessage('이메일을 확인한 후 비밀번호를 재설정해 주시기 바랍니다.');
        setErrorMessage('');
        setAlertSeverity('success');
      } else {
        throw new Error(
          response.message || '비밀번호 찾기 요청에 실패했습니다.'
        );
      }
    } catch (err: any) {
      setMessage('');
      setErrorMessage(
        err.message || '비밀번호 찾기 요청에 실패했습니다. 다시 시도해주세요.'
      );
      setAlertSeverity('error');
    } finally {
      setLoading(false);
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Head>
        <title>비밀번호 찾기</title>
        <meta name='description' content='비밀번호 찾기 페이지입니다.' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
      </Head>

      <div className={styles.pageContainer}>
        <h1 className={styles.FindTitle}>비밀번호 찾기</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.inputGroup}>
          <span className={styles.findText}>
            <Image
              className={styles.emailInputIcon}
              src={triptuneIcon}
              alt='이메일 주소 입력'
            />
            이메일 주소를 입력하면 비밀번호 변경 링크가 전송됩니다.
          </span>
          <hr className={styles.hrStyle} />
          <div className={styles.containEmail}>
            <label className={styles.labelEmail} htmlFor='email'>
              이메일
            </label>
            <br />
            <br />
            <input
              type='email'
              id='email'
              placeholder='이메일 주소 입력'
              {...register('email', {
                required: '이메일을 입력해주세요.',
                validate: validateEmail,
              })}
              className={errors.email ? styles.inputError : styles.input}
            />
            {errors.email && (
              <p className={styles.errorText}>{errors.email.message}</p>
            )}
          </div>
          <button
            type='submit'
            className={`${styles.submitButton} ${!isValid ? styles.disabledButton : ''}`}
            disabled={!isValid || loading}
          >
            {loading ? <VerificationLoading /> : '비밀번호 찾기'}
          </button>
        </form>
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={(event) => handleAlertClose(event, 'timeout')}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertSeverity === 'success' ? message : errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function WrappedFindPage() {
  return (
    <Suspense fallback={<DataLoading />}>
      <FindPage />
    </Suspense>
  );
}
