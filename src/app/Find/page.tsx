'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Head from 'next/head';
import { requestFindPassword } from '@/apis/Login/findApi';
import VerificationLoading from '@/components/Common/VerificationLoading';
import DataLoading from '@/components/Common/DataLoading';
import styles from '@/styles/Find.module.css';
import { validateEmail } from '@/utils/validation';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor, SnackbarCloseReason } from '@mui/material';

function FindPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success');
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsEmailValid(validateEmail(email) === true);
  }, [email]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAlertClose = (
    event: React.SyntheticEvent<any, Event> | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  const handleFindPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isEmailValid) {
      setErrorMessage('유효한 이메일을 입력해주세요.');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await requestFindPassword(email);
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
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <div className={styles.pageContainer}>
        <h1 className={styles.FindTitle}>비밀번호 찾기</h1>
        <form onSubmit={handleFindPasswordSubmit} className={styles.inputGroup}>
          <p className={styles.findText}>
            이메일을 입력해주세요. 이메일로 비밀번호 변경 링크가 전송됩니다.
          </p>
          <label htmlFor='email'>이메일</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={handleEmailChange}
            required
            placeholder='이메일 주소 입력'
            className={styles.input}
          />
          <button
            type='submit'
            className={`${styles.submitButton} ${!isEmailValid ? styles.disabledButton : ''}`}
            disabled={!isEmailValid || loading}
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
