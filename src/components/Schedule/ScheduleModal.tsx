import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import triptuneIcon from '../../../public/assets/icons/ic_triptune.png';
import { ko } from 'date-fns/locale';

registerLocale('ko', ko);

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date | null, endDate: Date | null) => void;
}

const ScheduleModal = ({ isOpen, onClose, onConfirm }: ScheduleModalProps) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  
  const getFormattedDate = (date: Date | null) => {
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
        <button className={styles.confirmButton} onClick={() => onConfirm(startDate, endDate)}>
          생성
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;
