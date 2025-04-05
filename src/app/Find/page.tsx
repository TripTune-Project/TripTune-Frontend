'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Head from 'next/head';
import { requestFindId, requestFindPassword } from '@/apis/Login/findApi';
import { useRouter, useSearchParams } from 'next/navigation';
import VerificationLoading from '@/components/Common/VerificationLoading';
import styles from '@/styles/Find.module.css';
import { validateEmail, validateUserId } from '@/utils/validation';
import DataLoading from '@/components/Common/DataLoading';

const FindPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'findId';
  
  const [tab, setTab] = useState<'findId' | 'findPassword'>(
    initialTab as 'findId' | 'findPassword'
  );
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isUserIdValid, setIsUserIdValid] = useState(false);
  
  useEffect(() => {
    setTab(initialTab as 'findId' | 'findPassword');
  }, [initialTab]);
  
  useEffect(() => {
    setIsEmailValid(validateEmail(email) === true);
    setIsUserIdValid(validateUserId(userId) === true);
  }, [email, userId]);
  
  const handleTabChange = (tab: 'findId' | 'findPassword') => {
    setTab(tab);
    setEmail('');
    setUserId('');
    setMessage('');
    setErrorMessage('');
    setAlertOpen(false);
  };
  
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  
  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };
  
  const handleFindIdSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!isEmailValid) {
      setErrorMessage('유효한 이메일을 입력해주세요.');
      setAlertSeverity('error');
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 5000);
      return;
    }
    
    setLoading(true);
    try {
      const responseMessage = await requestFindId(email);
      if (responseMessage.data.userId) {
        router.push(`/Find/Complete?userId=${responseMessage.data.userId}`);
      }
    } catch (error:any) {
      setErrorMessage(error.message as string);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFindPasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!isEmailValid || !isUserIdValid) {
      setErrorMessage('유효한 이메일과 아이디를 입력해주세요.');
      setAlertSeverity('error');
      setAlertOpen(true);
      setTimeout(() => setAlertOpen(false), 3000);
      return;
    }
    
    setLoading(true);
    try {
      const responseMessage = await requestFindPassword(email, userId);
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
        <title>아이디 / 비밀번호 찾기</title>
        <meta
          name='description'
          content='아이디 및 비밀번호 찾기 페이지입니다. 이메일과 아이디를 입력하여 정보를 찾으세요.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta property='og:title' content='아이디 / 비밀번호 찾기' />
        <meta
          property='og:description'
          content='아이디와 비밀번호를 찾는 페이지입니다.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://www.triptune.site/Find' />
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <div className={styles.pageContainer}>
        <h1 className={styles.FindTitle}>아이디 / 비밀번호 찾기</h1>
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${tab === 'findId' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('findId')}
          >
            아이디 찾기
          </button>
          <button
            className={`${styles.tabButton} ${tab === 'findPassword' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('findPassword')}
          >
            비밀번호 찾기
          </button>
        </div>
        {tab === 'findId' ? (
          <div className={styles.inputGroup}>
            <p className={styles.findText}>
              가입할 때 사용한 이메일을 입력하시면 아이디를 찾을 수 있습니다.
            </p>
            <p>이메일</p>
            <input
              type='email'
              id='email'
              value={email}
              placeholder='이메일 주소 입력'
              onChange={handleEmailChange}
              required
              className={styles.input}
            />
            <button
              type='submit'
              className={`${styles.submitButton} ${!isEmailValid ? styles.disabledButton : ''}`}
              onClick={handleFindIdSubmit}
              disabled={!isEmailValid || loading}
            >
              {loading ? <VerificationLoading /> : '아이디 찾기'}
            </button>
          </div>
        ) : (
          <div className={styles.inputGroup}>
            <p className={styles.findText}>
              가입한 아이디, 이메일을 입력해주세요.
            </p>
            <p className={styles.findText}>
              이메일을 통해 비밀번호 변경 링크가 전송됩니다.
            </p>
            <p>아이디</p>
            <input
              type='text'
              id='userId'
              value={userId}
              onChange={handleUserIdChange}
              required
              placeholder='아이디 입력'
              className={styles.input}
            />
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
              className={`${styles.submitButton} ${!isEmailValid || !isUserIdValid ? styles.disabledButton : ''}`}
              onClick={handleFindPasswordSubmit}
              disabled={!isEmailValid || !isUserIdValid || loading}
            >
              {loading ? <VerificationLoading /> : '비밀번호 찾기'}
            </button>
          </div>
        )}
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
