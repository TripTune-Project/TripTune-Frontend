'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { validateNickname, validatePassword } from '@/utils/validation';
import styles from '@/styles/Join.module.css';
import { useRouter } from 'next/navigation';
import { joinMember } from '@/apis/Join/joinApi';
import EmailVerification from './EmailVerification';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface JoinFormData {
  nickname: string;
  password: string;
  rePassword: string;
  email: string;
  authCode?: string;
}

const JoinForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setFocus,
    formState: { errors, isValid },
  } = useForm<JoinFormData>({ mode: 'onChange' });

  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
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
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const { authCode, ...submitData } = data;
      const response = await joinMember(submitData);
      if (!response.success) {
        setNotificationMessage(response.message);
        if (response.message.includes('닉네임')) {
          setFocus('nickname');
        } else if (response.message.includes('비밀번호')) {
          setFocus('password');
        } else if (response.message.includes('이메일')) {
          setFocus('email');
        }
        setAlertSeverity('error');
        setOpenSnackbar(true);
        return;
      }
      // 회원가입 성공 시 환영 메시지 표시
      const nickname = response.data?.nickname || data.nickname;
      setNotificationMessage(`환영합니다. ${nickname}님`);
      setAlertSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push('/Login');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setNotificationMessage(error.message);
        if (error.message.includes('닉네임')) {
          setFocus('nickname');
        } else if (error.message.includes('비밀번호')) {
          setFocus('password');
        } else if (error.message.includes('이메일')) {
          setFocus('email');
        }
      } else {
        setNotificationMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
      setAlertSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const onError = () => {
    setNotificationMessage('입력값을 확인해주세요.');
    setAlertSeverity('error');
    setOpenSnackbar(true);
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
  };

  return (
    <div className={styles.joinBackground}>
      <div className={styles.joinContainer}>
        <h3 className={styles.joinTitle}>회원가입</h3>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <EmailVerification
            register={register}
            getValues={getValues}
            setIsVerificationComplete={setIsVerificationComplete}
            isVerificationComplete={isVerificationComplete}
            errors={errors}
            errorMessage={''}
          />
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
              {...register('rePassword', {
                validate: (value) =>
                  value === watch('password') ||
                  '비밀번호가 일치하지 않습니다.',
              })}
              className={errors.rePassword ? styles.inputError : styles.input}
            />
            {errors.rePassword && (
              <p className={styles.errorText}>{errors.rePassword.message}</p>
            )}
          </div>
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
            회원가입 하기
          </button>
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
