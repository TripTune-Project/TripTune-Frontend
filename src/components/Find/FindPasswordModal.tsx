'use client';

import React, { useState } from 'react';
import styles from '../../styles/Login.module.css';
import { requestFindPassword } from '../../api/findApi';

interface FindPasswordModalProps {
  closeModal: () => void;
}

const FindPasswordModal: React.FC<FindPasswordModalProps> = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const responseMessage = await requestFindPassword(email, username);
      setMessage(responseMessage);
      setErrorMessage('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('비밀번호 찾기 요청에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };
  
  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>비밀번호 찾기</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            제출하기
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        <button onClick={closeModal} className={styles.closeButton}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default FindPasswordModal;
