'use client';

import React from 'react';
import PlacesScheduleMap from '@/components/Schedule/PlacesScheduleMap';
import ScheduleMake from '@/components/Schedule/ScheduleMake';
import styles from '../../../styles/Schedule.module.css';
import Chatting from '@/components/Schedule/Chatting';

export default function ScheduleDetail() {
  
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.leftSection}>
        <ScheduleMake />
      </div>
      <div className={styles.centerSection}>
        <PlacesScheduleMap places={[]} />
      </div>
      <div className={styles.rightSection}>
        <Chatting />
      </div>
    </div>
  );
}
