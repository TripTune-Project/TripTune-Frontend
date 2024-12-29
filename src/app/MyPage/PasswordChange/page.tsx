'use client';

import React, { useState } from 'react';
import styles from '@/styles/Mypage.module.css';

const PasswordChange = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleEmailVerification = async () => {
    // 인증 로직
    if (email) {
      alert('이메일로 인증 코드가 발송되었습니다.');
    }
  };

  const handleVerificationCode = () => {
    // 인증 코드 확인 로직
    if (verificationCode === '1234') {
      setIsVerified(true);
      alert('인증되었습니다.');
    } else {
      alert('인증 코드가 올바르지 않습니다.');
    }
  };

  const handlePasswordChange = async () => {
    // 비밀번호 변경 로직
    if (newPassword === confirmPassword) {
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } else {
      alert('새 비밀번호와 확인이 일치하지 않습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>비밀번호 변경</h2>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type='email'
            placeholder='가입한 이메일'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={handleEmailVerification}
            className={styles.actionButton}
          >
            인증하기
          </button>
        </div>
        <div className={styles.inputGroup}>
          <input
            type='text'
            placeholder='유효시간'
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={handleVerificationCode}
            className={styles.actionButton}
          >
            확인
          </button>
        </div>
        <div className={styles.inputGroup}>
          <input
            type='password'
            placeholder='기존 비밀번호'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.input}
            disabled={!isVerified}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type='password'
            placeholder='새 비밀번호'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            disabled={!isVerified}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type='password'
            placeholder='새 비밀번호 확인'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            disabled={!isVerified}
          />
        </div>
        <button
          onClick={handlePasswordChange}
          className={styles.saveButton}
          disabled={!isVerified}
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default PasswordChange;
