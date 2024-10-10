'use client';

import React, { useState } from 'react';
import ScheduleModal from '@/components/Schedule/ScheduleModal';
import PlacesScheduleMap from '@/components/Schedule/PlacesScheduleMap';
import ScheduleMake from '@/components/Schedule/ScheduleMake';
import styles from '../../styles/Schedule.module.css';
import { createSchedule } from '@/api/scheduleApi';
import Chatting from '@/components/Schedule/Chatting';

export default function Schedule() {
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal open by default on page load
  const [scheduleId, setScheduleId] = useState<number | null>(null);
  const [scheduleData, setScheduleData] = useState({
    travelName: '',
    startDate: null,
    endDate: null,
  });
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleConfirm = async (startDate: Date | null, endDate: Date | null, travelName: string) => {
    const newScheduleData = { startDate, endDate, travelName };
    setScheduleData(newScheduleData);
    
    try {
      const response = await createSchedule(newScheduleData);
      if (response && response.data.scheduleId) {
        setScheduleId(response.data.scheduleId);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('일정 생성 실패:', error);
    }
  };
  
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.leftSection}>
        <ScheduleMake scheduleData={scheduleData} />
      </div>
      <div className={styles.centerSection}>
        <PlacesScheduleMap places={[]} />
      </div>
      <div className={styles.rightSection}>
        <Chatting />
      </div>
      <ScheduleModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} />
    </div>
  );
}
