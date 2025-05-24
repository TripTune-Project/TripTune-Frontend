import React, { memo } from 'react';
import styles from '@/styles/Travel.module.css';

const TravelList: React.FC = memo(() => {
  return (
    <div className={styles.travelList}>
      {/* 여행 목록 내용 */}
    </div>
  );
});

TravelList.displayName = 'TravelList';

export default TravelList; 