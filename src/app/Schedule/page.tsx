'use client';

import React, { useState, useEffect } from 'react';
import ScheduleModal from '../../components/Schedule/ScheduleModal';
import PlacesScheduleMap from '@/components/Schedule/PlacesScheduleMap';
import ScheduleMake from '@/components/Schedule/ScheduleMake';
import styles from '../../styles/Schedule.module.css';
import Chatting from '@/components/Schedule/Chatting';

export default function Schedule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleConfirm = (startDate: Date | null, endDate: Date | null) => {
    console.log('시작 날짜:', startDate);
    console.log('종료 날짜:', endDate);
    handleCloseModal();
  };
  
  useEffect(() => {
    setIsModalOpen(true);
  }, []);
  
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.leftSection}>
        <ScheduleMake />
      </div>
      <div className={styles.centerSection}>
        <PlacesScheduleMap places={[]} />
      </div>
      <div className={styles.rightSection}>
        <Chatting/>
      </div>
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
