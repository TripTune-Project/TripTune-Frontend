'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Head from 'next/head';
import { requestFindPassword } from '@/apis/Login/findApi';
import VerificationLoading from '@/components/Common/VerificationLoading';
import styles from '@/styles/Find.module.css';
import { validateEmail } from '@/utils/validation';
import DataLoading from '@/components/Common/DataLoading';

const FindPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsEmailValid(validateEmail(email) === true);
  }, [email]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleFindPasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isEmailValid) {
      setErrorMessage('유효한 이메일을 입력해주세요.');
      setAlertSeverity('error');
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const responseMessage = await requestFindPassword(email);
      if (responseMessage.success) {
        setMessage('이메일을 확인한 후 비밀번호를 재설정해 주시기 바랍니다.');
        setErrorMessage('');
        setAlertSeverity('success');
      } else {
        throw new Error(
          responseMessage.message || '비밀번호 찾기 요청에 실패했습니다.'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          '비밀번호 찾기 요청에 실패했습니다. 다시 시도해주세요.'
        );
      }
      setMessage('');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>비밀번호 찾기</title>
        <meta
          name='description'
          content='비밀번호 찾기 페이지입니다. 필요한 정보를 입력하여 정보를 찾으세요.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta property='og:title' content='비밀번호 찾기' />
        <meta
          property='og:description'
          content='비밀번호를 찾는 페이지입니다.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://www.triptune.site/Find' />
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <div className={styles.pageContainer}>
        <h1 className={styles.FindTitle}>비밀번호 찾기</h1>
        <div className={styles.inputGroup}>
          <p className={styles.findText}>
            이메일을 입력해주세요. 이메일로 비밀번호 변경 링크가 전송됩니다.
          </p>
          <p>이메일</p>
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
            onClick={handleFindPasswordSubmit}
            disabled={!isEmailValid || loading}
          >
            {loading ? <VerificationLoading /> : '비밀번호 찾기'}
          </button>
        </div>
        {alertOpen && (
          <div
            className={`${styles.alert} ${alertSeverity === 'success' ? styles.alertSuccess : styles.alertError}`}
          >
            {alertSeverity === 'success' ? message : errorMessage}
          </div>
        )}
      </div>
    </>
  );
};

const WrappedFindPage = () => (
  <Suspense fallback={<DataLoading />}>
    <FindPage />
  </Suspense>
);

export default WrappedFindPage;
