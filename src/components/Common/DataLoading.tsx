import React from 'react';
import styles from '../../styles/DataLoading.module.css';

const DataLoading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default DataLoading;
