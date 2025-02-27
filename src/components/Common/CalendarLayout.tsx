import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Schedule.module.css';
import { ko } from 'date-fns/locale';
import { createNewSchedule } from '@/apis/Schedule/scheduleApi';
import { useTravelStore } from '@/store/scheduleStore';
import Image from 'next/image';
import triptuneIcon from '../../../public/assets/images/로고/triptuneIcon-removebg.png';

registerLocale('ko', ko);

interface CalendarLayoutProps {
  mode: 'create' | 'update';
  initialStartDate?: string;
  initialEndDate?: string;
  travelName?: string;
  onClose: () => void;
}

const CalendarLayout = ({
                          mode,
                          initialStartDate,
                          initialEndDate,
                          travelName = '',
                          onClose,
                        }: CalendarLayoutProps) => {
  const today = new Date();
  const { updateScheduleDetail } = useTravelStore();
  const [startDate, setStartDate] = useState<Date | null>(
    initialStartDate ? new Date(initialStartDate) : today
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialEndDate ? new Date(initialEndDate) : today
  );
  const [scheduleName, setScheduleName] = useState<string>(travelName);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  
  useEffect(() => {
    setIsFormValid(scheduleName.trim() !== '' && startDate !== null && endDate !== null);
  }, [startDate, endDate, scheduleName]);
  
  const handleConfirm = async () => {
    if (!isFormValid) return;
    
    if (mode === 'create') {
      const scheduleData = {
        scheduleName,
        startDate: startDate?.toISOString() || '',
        endDate: endDate?.toISOString() || '',
      };
      try {
        const response = await createNewSchedule(scheduleData);
        if (response?.data) {
          onClose();
          window.location.href = `/Schedule/${response.data.scheduleId}`;
        }
      } catch (error) {
        console.error('일정 생성 실패:', error);
      }
    } else {
      updateScheduleDetail({
        startDate: startDate?.toISOString() || '',
        endDate: endDate?.toISOString() || '',
      });
      onClose();
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 className={styles.detailTitle}>
          <Image src={triptuneIcon} alt='일정만들기' width={40} priority />
          &nbsp; {mode === 'create' ? '일정 만들기' : '일정 수정'}
        </h2>
        {mode === 'create' && (
          <div className={styles.inputGroup}>
            <label>여행 이름</label>
            <input
              type='text'
              className={styles.inputField}
              placeholder='여행 이름을 입력해주세요.'
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
            />
          </div>
        )}
        <div className={styles.inputGroup}>
          <label>여행 날짜</label>&nbsp;&nbsp;
          {startDate?.toLocaleDateString('ko-KR')} ~ {endDate?.toLocaleDateString('ko-KR')}
        </div>
        <div className={styles.datePickerContainer}>
          <DatePicker
            locale='ko'
            selected={startDate || undefined}
            onChange={(dates: [Date | null, Date | null]) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate || undefined}
            endDate={endDate || undefined}
            minDate={today}
            selectsRange
            inline
            monthsShown={2}
            dateFormat='yyyy.MM.dd'
          />
        </div>
        <button
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={!isFormValid}
        >
          {mode === 'create' ? '생성' : '수정'}
        </button>
      </div>
    </div>
  );
};

export default CalendarLayout;
