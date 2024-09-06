'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { requestFindId, requestFindPassword } from '@/api/findApi';
import { useRouter, useSearchParams } from 'next/navigation';
import VerificationLoading from '../../components/Common/VerificationLoading';
import styles from '../../styles/Find.module.css';
import { validateEmail, validateUserId } from '../../utils/validation';

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
      if (responseMessage.success) {
        setAlertSeverity('success');
        router.push(`/Find/Complete?userId=${responseMessage.data.userId}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        router.push(`/Find/Complete?userId=undefined`);
      } else {
        setErrorMessage('아이디 찾기 요청에 실패했습니다. 다시 시도해주세요.');
      }
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
      setTimeout(() => setAlertOpen(false), 5000);
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
        throw new Error('비밀번호 찾기 요청에 실패했습니다.');
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
      setAlertOpen(true);
      setTimeout(() => {
        setAlertOpen(false);
        setEmail('');
        setUserId('');
      }, 5000);
    }
  };

  return (
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
  );
};

const WrappedFindPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <FindPage />
  </Suspense>
);

export default WrappedFindPage;
