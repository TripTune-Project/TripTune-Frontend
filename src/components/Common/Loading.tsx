import React from 'react';
import styles from '@/styles/Loading.module.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium', text }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
};

export default Loading; 