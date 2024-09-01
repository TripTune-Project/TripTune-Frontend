'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  validateNickname,
  validateUserId,
  validatePassword,
} from '@/utils/validation';
import styles from '../../styles/Join.module.css';
import { useRouter } from 'next/navigation';
import { joinMember } from '@/api/joinApi';
import EmailVerification from './EmailVerification';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface JoinFormData {
  nickname: string;
  userId: string;
  password: string;
  repassword: string;
  email: string;
  authCode?: string;
}

const JoinForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<JoinFormData>({ mode: 'onChange' });
  
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  
  const router = useRouter();
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  const onSubmit = async (data: JoinFormData) => {
    if (!isVerificationComplete) {
      setNotificationMessage('이메일 인증을 완료해주세요.');
      setErrorMessage('이메일 인증을 완료해주세요.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    try {
      const { authCode, ...submitData } = data;
      await joinMember(submitData);
      setNotificationMessage(
        `${data.nickname} 고객님 회원가입을 축하드립니다!`
      );
      setAlertSeverity('success');
      setOpenSnackbar(true);
      
      setTimeout(() => {
        router.push('/Login');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setNotificationMessage(error.message);
      } else {
        setErrorMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
        setNotificationMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
      setAlertSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
  };
  
  return (
    <div className={styles.joinBackground}>
      <div className={styles.joinContainer}>
        <h3 className={styles.joinTitle}>회원가입</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              placeholder='아이디 (영문 대/소문자, 숫자 조합 4 ~ 15자리)'
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
              placeholder='닉네임 (영문 대/소문자, 숫자 조합 4 ~ 15자리)'
              {...register('nickname', {
                required: '닉네임을 입력해주세요.',
                validate: validateNickname,
              })}
              className={errors.nickname ? styles.inputError : styles.input}
            />
            {errors.nickname && (
              <p className={styles.errorText}>{errors.nickname.message}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type='password'
              placeholder='비밀번호 (영문 대/소문자, 숫자, 특수문자 조합 8 ~ 15자리)'
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
          <div className={styles.inputGroup}>
            <input
              type='password'
              placeholder='비밀번호 재입력'
              {...register('repassword', {
                validate: (value) =>
                  value === watch('password') ||
                  '비밀번호가 일치하지 않습니다.',
              })}
              className={errors.repassword ? styles.inputError : styles.input}
            />
            {errors.repassword && (
              <p className={styles.errorText}>{errors.repassword.message}</p>
            )}
          </div>
          <EmailVerification
            register={register}
            getValues={getValues}
            setErrorMessage={setErrorMessage}
            setIsVerificationComplete={setIsVerificationComplete}
            isVerificationComplete={isVerificationComplete}
            errors={errors}
            errorMessage={errorMessage}
          />
          <div className={styles.checkboxGroup}>
            <input
              type='checkbox'
              checked={isAgreed}
              onChange={handleAgreementChange}
            />
            <label>개인정보 수집 및 이용 동의</label>
          </div>
          <button
            type='submit'
            className={styles.submitButton}
            disabled={!isValid || !isAgreed || !isVerificationComplete}
          >
            회원가입하기
          </button>
          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
          {notificationMessage && (
            <p className={styles.notificationMessage}>{notificationMessage}</p>
          )}
        </form>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default JoinForm;
