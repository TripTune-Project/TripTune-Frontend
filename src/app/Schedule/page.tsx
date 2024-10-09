'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ScheduleModal from '../../components/Schedule/ScheduleModal';
import PlacesScheduleMap from '@/components/Schedule/PlacesScheduleMap';
import ScheduleMake from '@/components/Schedule/ScheduleMake';
import styles from '../../styles/Schedule.module.css';
import Chatting from '@/components/Schedule/Chatting';

export default function Schedule() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    travelName: '',
    startDate: null,
    endDate: null,
  });
  
  useEffect(() => {
    const accessToken = Cookies.get('trip-tune_at');
    const refreshToken = Cookies.get('trip-tune_rt');
    
    if (!accessToken || !refreshToken) {
      // alert("로그인 정보가 없어 로그인을 먼저 시도 해주세요.")
      router.push('/Login');
      return;
    }
    
    setIsModalOpen(true);
  }, [router]);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleConfirm = (startDate: Date | null, endDate: Date | null, travelName: string) => {
    console.log('시작 날짜:', startDate);
    console.log('종료 날짜:', endDate);
    setScheduleData({ startDate, endDate, travelName });
    handleCloseModal();
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
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
