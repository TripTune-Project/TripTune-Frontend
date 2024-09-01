import React from 'react';
import styles from '../../styles/VerificationLoading.module.css';

const VerificationLoading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default VerificationLoading;
