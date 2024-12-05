'use client';

import React, { useEffect } from 'react';
import styles from '@/styles/Schedule.module.css';
import ScheduleTravelSearch from '@/components/Schedule/ScheduleTravelSearch';
import ScheduleRoute from '@/components/Schedule/ScheduleRoute';
import CalendarModal from '@/components/Common/CalendarModal';
import { useParams } from 'next/navigation';
import { useTravelStore } from '@/store/scheduleStore';

interface ScheduleMakeProps {
  initialTab: string;
}

const ScheduleMake = ({ initialTab }: ScheduleMakeProps) => {
  const { scheduleId } = useParams();
  const {
    scheduleDetail,
    fetchScheduleDetailById,
    updateScheduleDetail,
  } = useTravelStore();
  
  const [tab, setTab] = React.useState(initialTab);
  const [showModal, setShowModal] = React.useState(false);
  
  useEffect(() => {
    if (scheduleId) {
      fetchScheduleDetailById(scheduleId, 1);
    }
  }, [scheduleId, fetchScheduleDetailById]);
  
  const handleTabChange = (newTab: string) => {
    setTab(newTab);
  };
  
  const handleModalSubmit = (startDate: string, endDate: string) => {
    updateScheduleDetail('startDate', startDate);
    updateScheduleDetail('endDate', endDate);
    setShowModal(false);
  };
  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.inputGroup}>
        <label>여행 이름</label>
        <input
          type="text"
          className={styles.inputField}
          value={scheduleDetail?.scheduleName || ''}
          placeholder="여행 이름을 입력해주세요."
          onChange={(e) =>
            updateScheduleDetail('scheduleName', e.target.value)
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>여행 날짜</label>
        <input
          type="text"
          className={styles.inputField}
          value={`${scheduleDetail?.startDate || ''} ~ ${
            scheduleDetail?.endDate || ''
          }`}
          placeholder="시작일 ~ 종료일"
          onClick={() => setShowModal(true)}
        />
      </div>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            tab === 'scheduleTravel' ? styles.activeTab : ''
          }`}
          onClick={() => handleTabChange('scheduleTravel')}
        >
          여행지
        </button>
        <button
          className={`${styles.tabButton} ${
            tab === 'travelRoot' ? styles.activeTab : ''
          }`}
          onClick={() => handleTabChange('travelRoot')}
        >
          여행 루트
        </button>
      </div>
      {tab === 'scheduleTravel' ? <ScheduleTravelSearch /> : <ScheduleRoute />}
      {showModal && (
        <CalendarModal
          initialStartDate={scheduleDetail?.startDate || ''}
          initialEndDate={scheduleDetail?.endDate || ''}
          onClose={() => setShowModal(false)}
          onSubmit={(startDate, endDate) => handleModalSubmit(startDate, endDate)}
        />
      )}
    </div>
  );
};

export default ScheduleMake;
