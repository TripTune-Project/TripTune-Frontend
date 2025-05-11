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
  register: UseFormRegister<JoinFormData>; // react-hook-form 등록 함수
  getValues: UseFormGetValues<JoinFormData>; // 폼 값 가져오기 함수
  setIsVerificationComplete: React.Dispatch<React.SetStateAction<boolean>>; // 인증 완료 상태 업데이트 함수
  isVerificationComplete: boolean; // 인증 완료 여부
  errors: FieldErrors<JoinFormData>; // 폼 유효성 검사 오류
  errorMessage: string; // 에러 메시지
}

const EmailVerification = ({
  register,
  getValues,
  setIsVerificationComplete,
  isVerificationComplete,
  errors,
}: EmailVerificationProps) => {
  // 상태 관리
  const [isVerificationSent, setIsVerificationSent] = useState(false); // 인증 메일 발송 여부
  const [isEmailDisabled, setIsEmailDisabled] = useState(false); // 이메일 입력 비활성화 여부
  const [notificationMessage, setNotificationMessage] = useState(''); // 알림 메시지
  const [openSnackbar, setOpenSnackbar] = useState(false); // 스낵바 표시 여부
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>( // 알림 종류
    'success'
  );
  const [loading, setLoading] = useState(false); // 로딩 상태

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
      const response = await requestEmailVerification(email);

      if (!response.success && response.error) {
        setAlertSeverity('error');
        setNotificationMessage(response.error || response.message);
        setOpenSnackbar(true);
        return;
      }

      setIsVerificationSent(true);
      setIsEmailDisabled(true);
      setAlertSeverity('success');
      setNotificationMessage(
        response.message || '인증 코드가 발송되었습니다. 이메일을 확인해주세요.'
      );
      setOpenSnackbar(true);
    } catch (error) {
      if (error instanceof Error) {
        setAlertSeverity('error');
        const errorMsg = error.message;
        if (errorMsg.includes('duplicate') || errorMsg.includes('중복')) {
          setNotificationMessage('이미 사용 중인 이메일 주소입니다.');
        } else {
          setNotificationMessage(errorMsg);
        }
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
      const response = await verifyEmail(email, authCode);

      if (!response.success && response.error) {
        setAlertSeverity('error');
        setNotificationMessage(response.error || response.message);
        setOpenSnackbar(true);
        return;
      }

      setIsVerificationComplete(true);
      setAlertSeverity('success');
      setNotificationMessage(
        response.message || '이메일 인증이 완료되었습니다.'
      );
      setOpenSnackbar(true);
    } catch (error) {
      if (error instanceof Error) {
        setAlertSeverity('error');
        const errorMsg = error.message;
        if (errorMsg.includes('invalid') || errorMsg.includes('유효하지 않')) {
          setNotificationMessage('인증 코드가 유효하지 않습니다.');
        } else {
          setNotificationMessage(errorMsg);
        }
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
          disabled={isEmailDisabled}
        />
        <button
          type='button'
          onClick={() => handleEmailVerificationRequest(getValues('email'))}
          className={styles.emailButton}
          disabled={
            !getValues('email') || !validateEmail(getValues('email')) || loading
          }
        >
          {loading ? <VerificationLoading /> : '인증 요청'}
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
            className={
              errors.authCode ? styles.inputError : styles.inputVerification
            }
          />
          <button
            type='button'
            onClick={handleEmailVerification}
            className={styles.verifyButton}
            disabled={!getValues('authCode') || loading}
          >
            {loading ? <VerificationLoading /> : '인증 확인'}
          </button>
        </div>
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
