'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Head from 'next/head';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../../../styles/Find.module.css';
import Image from 'next/image';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';
import VerificationLoading from '../../../components/Common/VerificationLoading';
import { validatePassword } from '@/utils/validation';

const ChangePassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const passwordToken = searchParams.get('passwordToken');
  const [password, setPassword] = useState('');
  const [rePassword, setRepassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isRepasswordValid, setIsRepasswordValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (!passwordToken) {
      console.error('passwordToken을 찾을 수 없습니다.');
    }
  }, [passwordToken]);

  useEffect(() => {
    const passwordValid = validatePassword(password) === true;
    const rePasswordValid = password === rePassword;
    setIsPasswordValid(passwordValid);
    setIsRepasswordValid(rePasswordValid);
    setIsFormValid(passwordValid && rePasswordValid);
  }, [password, rePassword]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!passwordToken) {
      alert('유효하지 않은 토큰입니다.');
      setLoading(false);
      return;
    }

    if (password !== rePassword) {
      alert('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/members/reset-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passwordToken, password, rePassword }),
      });

      const data = await response.json();

      if (data.success) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        router.push('/Login');
      } else {
        alert('비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      alert('비밀번호 변경에 실패했습니다.');
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
      <div className={styles.pageContainer}>
        <h1 className={styles.FindTitle}>비밀번호 재설정</h1>
        <div className={styles.completeText}>
          <Image
            src={triptuneIcon}
            alt={'파비콘'}
            width={31}
            height={20}
            priority
          />
          새롭게 설정할 비밀번호를 입력해 주세요.
        </div>
        <hr className={styles.hrStyle} />
        <p>새로운 비밀번호</p>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder={
            '비밀번호 (영문 대/소문자, 숫자, 특수문자 조합 8~15자리)'
          }
          className={styles.input}
        />
        {!isPasswordValid && password && (
          <div className={styles.errorText}>
            유효한 비밀번호 형식이 아닙니다.
          </div>
        )}
        <p> 비밀번호 재입력 </p>
        <input
          type='password'
          id='rePassword'
          value={rePassword}
          onChange={(e) => setRepassword(e.target.value)}
          required
          placeholder={'비밀번호 재입력'}
          className={styles.input}
        />
        {!isRepasswordValid && rePassword && (
          <div className={styles.errorText}>비밀번호가 일치하지 않습니다.</div>
        )}
        <button
          type='submit'
          className={styles.submitButton}
          onClick={handlePasswordChange}
          disabled={!isFormValid || loading}
        >
          {loading ? <VerificationLoading /> : '비밀번호 변경'}
        </button>
      </div>
    </>
  );
};

const ChangePasswordPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ChangePassword />
  </Suspense>
);

export default ChangePasswordPage;
