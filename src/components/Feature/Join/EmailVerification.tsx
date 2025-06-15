'use client';

import React, { useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormGetValues,
} from 'react-hook-form';
import { validateEmail } from '@/utils/validation';
import styles from '@/styles/Join.module.css';
import {
  requestEmailVerification,
  verifyEmail,
} from '@/apis/Verify/emailVerifyApi';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import VerificationLoading from '@/components/Common/VerificationLoading';

interface JoinFormData {
  nickname: string;
  password: string;
  rePassword: string;
  email: string;
  authCode?: string;
}

interface EmailVerificationProps {
  register: UseFormRegister<JoinFormData>;
  getValues: UseFormGetValues<JoinFormData>;
  setIsVerificationComplete: React.Dispatch<React.SetStateAction<boolean>>;
  isVerificationComplete: boolean;
  errors: FieldErrors<JoinFormData>;
  errorMessage: string;
}

const EmailVerification = ({
  register,
  getValues,
  setIsVerificationComplete,
  isVerificationComplete,
  errors,
}: EmailVerificationProps) => {
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [loading, setLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEmailVerificationRequest = async (email: string) => {
    if (!validateEmail(email)) {
      setAlertSeverity('error');
      setNotificationMessage('유효하지 않은 이메일 주소입니다.');
      setOpenSnackbar(true);
      return;
    }
    setLoading(true);
    try {
      await requestEmailVerification(email);
      setIsVerificationSent(true);
      setIsEmailDisabled(true);
      setAlertSeverity('success');
      setNotificationMessage(
        '인증 코드가 발송되었습니다. 이메일을 확인해주세요.'
      );
      setOpenSnackbar(true);
    } catch (error) {
      if (error instanceof Error) {
        setAlertSeverity('error');
        setNotificationMessage(error.message);
      } else {
        setAlertSeverity('error');
        setNotificationMessage(
          '인증 코드 요청에 실패했습니다. 다시 시도해주세요.'
        );
      }
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    const { email, authCode } = getValues();
    if (!authCode) {
      setAlertSeverity('error');
      setNotificationMessage('인증 코드를 입력해주세요.');
      setOpenSnackbar(true);
      return;
    }
    setLoading(true);
    try {
      await verifyEmail(email, authCode);
      setIsVerificationComplete(true);
      setAlertSeverity('success');
      setNotificationMessage('이메일 인증이 완료되었습니다.');
      setOpenSnackbar(true);
    } catch (error) {
      setIsVerificationComplete(false);
      if (error instanceof Error) {
        setAlertSeverity('error');
        setNotificationMessage(error.message);
      } else {
        setAlertSeverity('error');
        setNotificationMessage('인증 코드가 유효하지 않습니다.');
      }
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.emailGroup}>
        <input
          placeholder='이메일 인증'
          {...register('email', {
            required: '이메일 인증을 입력해주세요.',
            validate: validateEmail,
          })}
          className={errors.email ? styles.inputError : styles.emailInput}
          disabled={isEmailDisabled || isVerificationComplete}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.value) {
              register('email').onChange(e);
            }
          }}
        />
        <button
          type='button'
          onClick={() => handleEmailVerificationRequest(getValues('email'))}
          className={isVerificationComplete ? styles.verifiedButton : styles.emailButton}
          disabled={loading || isVerificationComplete}
        >
          {isVerificationComplete ? '인증 완료' : (loading ? <VerificationLoading /> : '인증 요청')}
        </button>
      </div>
      {errors.email && (
        <div className={styles.errorText}>{errors.email.message}</div>
      )}
      {isVerificationSent && !isVerificationComplete && (
        <div className={styles.emailGroup}>
          <input
            placeholder='인증 코드 입력'
            {...register('authCode', {
              required: '인증 코드를 입력해주세요.',
            })}
            className={errors.authCode ? styles.inputError : styles.inputVerification}
            disabled={isVerificationComplete}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.value) {
                register('authCode').onChange(e);
              }
            }}
          />
          <button
            type='button'
            onClick={handleEmailVerification}
            className={isVerificationComplete ? styles.verifiedButton : styles.verifyButton}
            disabled={loading || isVerificationComplete}
          >
            {isVerificationComplete ? '인증 완료' : (loading ? <VerificationLoading /> : '인증 확인')}
          </button>
        </div>
      )}
      {errors.authCode && (
        <div className={styles.errorText}>{errors.authCode.message}</div>
      )}
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
    </>
  );
};

export default EmailVerification;