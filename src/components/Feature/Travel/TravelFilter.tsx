import React, { memo } from 'react';
import styles from '@/styles/Travel.module.css';

const TravelFilter: React.FC = memo(() => {
  return (
    <div className={styles.travelFilter}>
      {/* 필터 내용 */}
    </div>
  );
});

TravelFilter.displayName = 'TravelFilter';

export default TravelFilter; 