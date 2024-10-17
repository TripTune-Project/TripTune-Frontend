import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import triptuneIcon from '../../../public/assets/icons/ic_triptune.png';
import { ko } from 'date-fns/locale';
import { createNewSchedule } from '@/api/scheduleApi';
import { useRouter } from 'next/navigation';

registerLocale('ko', ko);

interface ScheduleModalProps {
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose }) => {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [travelName, setTravelName] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const router = useRouter();
  
  useEffect(() => {
    today.setHours(0, 0, 0, 0);
    
    setIsFormValid(
      travelName.trim() !== '' &&
      startDate !== null &&
      endDate !== null &&
      startDate >= today &&
      startDate <= endDate
    );
  }, [travelName, startDate, endDate]);
  
  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const handleCreateSchedule = async (): Promise<void> => {
    if (!isFormValid) {
      console.error('모든 필드를 올바르게 입력해야 합니다.');
      return;
    }
    
    const scheduleData = {
      scheduleName: travelName,
      startDate: formatDateToString(startDate!),
      endDate: formatDateToString(endDate!),
    };
    
    try {
      const response = await createNewSchedule(scheduleData);
      
      if (response && response.data) {
        const scheduleId = response.data.scheduleId;
        onClose();  // 모달 닫기
        router.push(`/Schedule/${scheduleId}`);
      } else {
        console.error('일정 생성 실패');
      }
    } catch (error) {
      console.error('일정 생성 중 오류 발생:', error);
    }
  };
  
  const getFormattedDate = (date: Date | null): string => {
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
        <button className={styles.closeButton} onClick={onClose}>
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
            selected={startDate || undefined}
            onChange={(dates: [Date | null, Date | null]) => {
              let [start, end] = dates;
              if (end && start && start > end) {
                // 시작일이 종료일보다 나중인 경우, 서로 변경
                [start, end] = [end, start];
              }
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate || undefined}
            endDate={endDate || undefined}
            minDate={today}
            selectsRange
            inline
            monthsShown={2}
            dateFormat="yyyy.MM.dd"
            dayClassName={(date: Date) => {
              const day = date.getDay();
              return day === 0 ? styles.sunday : day === 6 ? styles.saturday : '';
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
