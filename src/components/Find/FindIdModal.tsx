'use client';

import React, { useState } from 'react';
import styles from '../../styles/Login.module.css';
import { requestFindId } from '../../api/findApi';

interface FindIdModalProps {
  closeModal: () => void;
}

const FindIdModal: React.FC<FindIdModalProps> = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const responseMessage = await requestFindId(email);
      setMessage(responseMessage);
      setErrorMessage('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('아이디 찾기 요청에 실패했습니다. 다시 시도해주세요.');
      }
      setMessage('');
    }
  };
  
  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>아이디 찾기</h2>
        <form onSubmit={handleSubmit}>
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

export default FindIdModal;
