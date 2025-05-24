import React, { memo } from 'react';
import styles from '@/styles/Travel.module.css';

const TravelMap: React.FC = memo(() => {
  return (
    <div className={styles.travelMap}>
      {/* 지도 내용 */}
    </div>
  );
});

TravelMap.displayName = 'TravelMap';

export default TravelMap; 