'use client';

import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import triptuneIcon from '../../../public/assets/icons/ic_triptune.png';
import { ko } from 'date-fns/locale';
import { createSchedule } from '@/api/scheduleApi';
import { useRouter } from 'next/navigation';

registerLocale('ko', ko);

const ScheduleModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [travelName, setTravelName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setIsFormValid(
      travelName.trim() !== '' &&
      startDate &&
      endDate &&
      startDate >= today &&
      startDate < endDate,
    );
  }, [travelName, startDate, endDate]);
  
  const formatDateToString = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleCreateSchedule = async () => {
    if (!isFormValid) {
      console.error('모든 필드를 올바르게 입력해야 합니다.');
      return;
    }
    
    const scheduleData = {
      scheduleName: travelName,
      startDate: formatDateToString(startDate),
      endDate: formatDateToString(endDate),
    };
    
    try {
      const response = await createSchedule(scheduleData);
      
      if (response) {
        const scheduleId = response.data.scheduleId;
        handleCloseModal();
        router.push(`/Schedule/${scheduleId}`);
      } else {
        console.error('일정 생성 실패');
      }
    } catch (error) {
      console.error('일정 생성 중 오류 발생:', error);
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
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={handleCloseModal}>
          &times;
        </button>
        <h2 className={styles.detailTitle}>
          <Image src={triptuneIcon} alt="일정만들기" priority /> 일정 만들기
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
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            selectsRange
            inline
            monthsShown={2}
            dateFormat="yyyy.MM.dd"
            dayClassName={(date) => {
              const day = date.getDay();
              return day === 0
                ? styles.sunday
                : day === 6
                  ? styles.saturday
                  : '';
            }}
          />
        </div>
        <button
          className={styles.confirmButton}
          onClick={handleCreateSchedule}
          disabled={!isFormValid}
        >
          생성
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;
