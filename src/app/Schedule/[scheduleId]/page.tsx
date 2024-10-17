'use client';

import React, { useState } from 'react';
import PlacesScheduleMap from '@/components/Schedule/PlacesScheduleMap';
import ScheduleMake from '@/components/Schedule/ScheduleMake';
import styles from '../../../styles/Schedule.module.css';
import Chatting from '@/components/Schedule/Chatting';

export default function ScheduleDetail() {
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
  
  const handleAddMarker = (marker: { lat: number; lng: number }) => {
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };
  
  return (
    <>
      <button className={styles.scheduleUpdateBtn}>일정 만들기 저장</button>
      <div className={styles.layoutContainer}>
        <div className={styles.leftSection}>
          <ScheduleMake onAddMarker={handleAddMarker} />
        </div>
        <div className={styles.centerSection}>
          <PlacesScheduleMap markers={markers} />
        </div>
        <div className={styles.rightSection}>
          <Chatting />
        </div>
      </div>
    </>
  );
}
