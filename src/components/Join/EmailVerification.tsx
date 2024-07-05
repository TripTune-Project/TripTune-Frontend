'use client';

import React, { useState } from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormGetValues,
} from 'react-hook-form';
import { validateEmail } from '../../utils/validation';
import styles from '../../styles/Join.module.css';
import { requestEmailVerification, verifyEmail } from '../../api/emailApi';
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

interface EmailVerificationProps {
  register: UseFormRegister<JoinFormData>;
  getValues: UseFormGetValues<JoinFormData>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsVerificationComplete: React.Dispatch<React.SetStateAction<boolean>>;
  isVerificationComplete: boolean;
  errors: FieldErrors<JoinFormData>;
  errorMessage: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
                                                               register,
                                                               getValues,
                                                               setErrorMessage,
                                                               setIsVerificationComplete,
                                                               isVerificationComplete,
                                                               errors,
                                                               errorMessage,
                                                             }) => {
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  const handleEmailVerificationRequest = async (email: string) => {
    if (!validateEmail(email)) {
      setAlertSeverity('error');
      setNotificationMessage('유효하지 않은 이메일 주소입니다.');
      setOpenSnackbar(true);
      setErrorMessage('유효하지 않은 이메일 주소입니다.');
      return;
    }
    
    try {
      await requestEmailVerification(email);
      setIsVerificationSent(true);
      setErrorMessage('');
      setAlertSeverity('success');
      setNotificationMessage('인증 코드가 발송되었습니다. 이메일을 확인해주세요.');
      setOpenSnackbar(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setAlertSeverity('error');
        setNotificationMessage(error.message);
      } else {
        setErrorMessage('인증 코드 요청에 실패했습니다. 다시 시도해주세요.');
        setAlertSeverity('error');
        setNotificationMessage('인증 코드 요청에 실패했습니다. 다시 시도해주세요.');
      }
      setOpenSnackbar(true);
    }
  };
  
  const handleEmailVerification = async () => {
    const { email, authCode } = getValues();
    
    try {
      if (authCode != null) {
        await verifyEmail(email, authCode);
      }
      setIsVerificationComplete(true);
      setErrorMessage('');
      setAlertSeverity('success');
      setNotificationMessage('이메일 인증이 완료되었습니다.');
      setOpenSnackbar(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setAlertSeverity('error');
        setNotificationMessage(error.message);
      } else {
        setErrorMessage('인증 코드가 유효하지 않습니다.');
        setAlertSeverity('error');
        setNotificationMessage('인증 코드가 유효하지 않습니다.');
      }
      setOpenSnackbar(true);
    }
  };
  
  const getEmailErrorMessage = () => {
    if (errors.email) {
      return errors.email.message;
    }
    return '';
  };
  
  return (
    <>
      <div className={styles.inputGroup}>
        <input
          placeholder="이메일 인증"
          {...register('email', {
            required: '이메일 인증을 입력해주세요.',
            validate: validateEmail,
          })}
          style={{ width: '390px' }}
          className={errors.email ? styles.inputError : styles.input_email_text}
        />
        <button
          type="button"
          onClick={() => handleEmailVerificationRequest(getValues('email'))}
          className={styles.verifyButton}
          disabled={isVerificationSent}
        >
          인증하기
        </button>
        {errors.email && (
          <p className={styles.errorText}>{getEmailErrorMessage()}</p>
        )}
      </div>
      {isVerificationSent && !isVerificationComplete && (
        <div className={`${styles.inputGroup} ${styles.emailInputGroup}`}>
          <input
            placeholder="인증 코드 입력"
            {...register('authCode', {
              required: '인증 코드를 입력해주세요.',
            })}
            className={
              errors.authCode ? styles.inputError : styles.inputVerification
            }
          />
          <button
            type="button"
            onClick={handleEmailVerification}
            className={styles.verifyButton}
          >
            인증 확인
          </button>
        </div>
      )}
      {isVerificationSent && isVerificationComplete && (
        <div className={styles.inputGroup}>
          <p className={styles.verifiedText}>이메일이 인증되었습니다.</p>
        </div>
      )}
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertSeverity} sx={{ width: '100%' }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EmailVerification;
