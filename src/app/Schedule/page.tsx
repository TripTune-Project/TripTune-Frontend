import React from 'react';
import styles from '@/styles/Schedule.module.css';
import ScheduleModal from '@/components/Schedule/ScheduleModal';

export default function Schedule() {
  
  return (
    <div className={styles.layoutContainer}>
      <ScheduleModal />
    </div>
  );
}
