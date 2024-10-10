'use client';

import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import triptuneIcon from '../../../public/assets/icons/ic_triptune.png';
import { ko } from 'date-fns/locale';
import { createSchedule } from '@/api/scheduleApi';
import { useRouter } from 'next/navigation';

registerLocale('ko', ko);

const ScheduleModal = ({ isOpen, onClose, onConfirm }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [travelName, setTravelName] = useState('');
  
  const handleCreateSchedule = async () => {
    if (!startDate || !endDate || !travelName) {
      console.error('모든 필드를 입력해야 합니다.');
      return;
    }
    
    const scheduleData = {
      startDate,
      endDate,
      travelName,
    };
    
    try {
      const response = await createSchedule(scheduleData);
      console.log('일정 생성 성공');
      if (response && response.data.scheduleId) {
        onConfirm(response.data.scheduleId);
      }
      onClose();
    } catch (error) {
      console.error('일정 생성 실패:', error);
    }
  };
  
  const getFormattedDate = (date) => {
    return date
      ? date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      : '';
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.detailTitle}>
          <Image src={triptuneIcon} alt="일정만들기" priority />
          일정 만들기
        </h2>
        <div className={styles.inputGroup}>
          <label>여행 이름</label>
          <input
            type="text"
            className={styles.inputField}
            placeholder="여행 이름을 입력해주세요."
            value={travelName}
            onChange={(e) => setTravelName(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>여행 날짜</label>
          <input
            type="text"
            className={styles.inputField}
            value={`${getFormattedDate(startDate)} ~ ${getFormattedDate(endDate)}`}
            readOnly
          />
        </div>
        <div className={styles.datePickerContainer}>
          <DatePicker
            locale="ko"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate ?? new Date()}
            endDate={endDate ?? new Date()}
            minDate={startDate ?? new Date()}
            inline
            monthsShown={2}
            dateFormat="yyyy.MM.dd"
            dayClassName={(date) => {
              const day = date.getDay();
              return day === 0 ? styles.sunday : day === 6 ? styles.saturday : '';
            }}
          />
        </div>
        <button className={styles.confirmButton} onClick={handleCreateSchedule}>
          생성
        </button>
      </div>
    </div>
  );
};

export default function Schedule() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleConfirm = (scheduleId) => {
    router.push(`/Schedule/${scheduleId}`);
  };
  
  return (
    <div className={styles.layoutContainer}>
      <ScheduleModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} />
    </div>
  );
}
