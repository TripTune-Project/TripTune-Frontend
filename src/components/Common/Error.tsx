import React from 'react';
import styles from '@/styles/Error.module.css';

interface ErrorProps {
  error?: Error | null;
  message?: string;
}

const Error: React.FC<ErrorProps> = ({ error, message = '오류가 발생했습니다.' }) => {
  return (
    <div className={styles.errorContainer} role="alert">
      <div className={styles.errorIcon}>⚠️</div>
      <h2 className={styles.errorTitle}>오류</h2>
      <p className={styles.errorMessage}>{message}</p>
      {error && (
        <details className={styles.errorDetails}>
          <summary>자세한 오류 정보</summary>
          <pre className={styles.errorStack}>{error.stack}</pre>
        </details>
      )}
      <button
        className={styles.retryButton}
        onClick={() => window.location.reload()}
        aria-label="페이지 새로고침"
      >
        다시 시도
      </button>
    </div>
  );
};

export default Error; 