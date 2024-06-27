'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { validatePassword, validateUserId } from '../../utils/validation';
import styles from '../../styles/Login.module.css';
import { useRouter } from 'next/navigation';
import useLogin from '../../hooks/useLogin';
import FindIdModal from '../Find/FindIdModal';
import FindPasswordModal from '../Find/FindPasswordModal';

interface LoginFormData {
  userId: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { loginUser } = useLogin();  // useLogin 훅 사용
  const [isFindIdModalOpen, setFindIdModalOpen] = useState(false);
  const [isFindPasswordModalOpen, setFindPasswordModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginUser(data);
      setNotificationMessage('로그인에 성공했습니다. 홈으로 이동합니다.');
      router.push('/Home');
    } catch (error) {
      console.error('로그인 에러:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setNotificationMessage(error.message);
      } else {
        setErrorMessage('로그인 중 오류가 발생했습니다.');
        setNotificationMessage('로그인 중 오류가 발생했습니다.');
      }
    }
  };
  
  const closeModal = () => {
    setFindIdModalOpen(false);
    setFindPasswordModalOpen(false);
  };
  
  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>LOGIN</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              placeholder="아이디"
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
              type="password"
              placeholder="비밀번호"
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
          
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isValid}
          >
            로그인하기
          </button>
        </form>
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        {notificationMessage && <p className={styles.notificationMessage}>{notificationMessage}</p>}
      </div>
      <hr className={styles.hr} />
      <div className={styles.linkContainer}>
        <div className={styles.join} onClick={() => router.push('/Join')}>
          회원가입
        </div>
        <div>
          <span
            className={styles.findId}
            onClick={() => setFindIdModalOpen(true)}
          >
            아이디 찾기
          </span>
          <span
            className={styles.findPassword}
            onClick={() => setFindPasswordModalOpen(true)}
          >
            비밀번호 찾기
          </span>
        </div>
      </div>
      
      {isFindIdModalOpen && <FindIdModal closeModal={closeModal} />}
      {isFindPasswordModalOpen && <FindPasswordModal closeModal={closeModal} />}
    </>
  );
};

export default LoginForm;
