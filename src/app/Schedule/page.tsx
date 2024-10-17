'use client';

import React, { useState } from 'react';
import styles from '@/styles/Schedule.module.css';
import ScheduleModal from '@/components/Schedule/ScheduleModal';

type Schedule = {
  id: number;
  routeFirstImg: string;
  name: string;
  startDate: string;
  endDate: string;
};

export default function Schedule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleList, setScheduleList] = useState<Schedule[]>([]); // 타입을 Schedule[]로 명시
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className={styles.createContainer}>
      <h1 className={styles.scheduleTitle}>일정 리스트 최근 리스트</h1>
      <button className={styles.createAddButton} onClick={handleOpenModal}>
        새 일정 리스트 추가
      </button>
      {scheduleList.length > 0 ? (
        <div className={styles.scheduleList}>
          {scheduleList.map((schedule) => (
            <div key={schedule.id} className={styles.scheduleItem}>
              <img
                src={schedule.routeFirstImg}
                alt="여행 루트 이미지"
                className={styles.scheduleImage}
              />
              <div className={styles.scheduleContent}>
                <div className={styles.scheduleName}>스케줄 이름: {schedule.name}</div>
                <div className={styles.scheduleDates}>
                  스케줄 날짜들: {schedule.startDate} ~ {schedule.endDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyMessage}>
          <p>아직 생성된 일정이 없습니다. 새 일정을 만들어 시작해 보세요.</p>
        </div>
      )}
      
      {isModalOpen && <ScheduleModal onClose={handleCloseModal} />}
    </div>
  );
}
