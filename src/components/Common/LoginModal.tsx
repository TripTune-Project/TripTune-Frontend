import React from 'react';
import styles from '../../styles/LoginModal.module.css';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>로그인이 필요합니다</h2>
        <p>이 기능을 사용하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?</p>
        <div className={styles.buttons}>
          <button onClick={onClose} className={styles.confirmButton}>
            로그인하기
          </button>
          <button onClick={() => setShowLoginModal(false)} className={styles.cancelButton}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
