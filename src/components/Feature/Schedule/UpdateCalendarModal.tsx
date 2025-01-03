import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Schedule.module.css';
import { ko } from 'date-fns/locale';
import { useTravelStore } from '@/store/scheduleStore';
import { isValidDateForUpdate } from '@/utils/index';

registerLocale('ko', ko);

interface CalendarModalProps {
  initialStartDate: string;
  initialEndDate: string;
  onClose: () => void;
}

const UpdateCalendarModal = ({
                               initialStartDate,
                               initialEndDate,
                               onClose,
                             }: CalendarModalProps) => {
  const { updateScheduleDetail } = useTravelStore();
  
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(
    initialStartDate ? new Date(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialEndDate ? new Date(initialEndDate) : today
  );
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  
  useEffect(() => {
    setIsFormValid(endDate !== null && isValidDateForUpdate(endDate));
  }, [endDate]);
  
  const formatDateToKoreanWithDay = (date: Date | null): string => {
    if (!date) return '';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    })
      .format(date)
      .replace(/\./g, '.')
      .replace(' ', '');
  };
  
  const handleConfirm = () => {
    if (isFormValid) {
      updateScheduleDetail({
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : '',
      });
      onClose();
    } else {
      console.error('종료 날짜는 오늘 이후여야 합니다.');
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.dateDisplay}>
          <p>
            선택한 날짜: {formatDateToKoreanWithDay(startDate)} ~{' '}
            {formatDateToKoreanWithDay(endDate)}
          </p>
        </div>
        <div className={styles.datePickerContainer}>
          <DatePicker
            locale='ko'
            selected={startDate || undefined}
            onChange={(dates: [Date | null, Date | null]) => {
              let [start, end] = dates;
              if (end && start && start > end) {
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
            dateFormat='yyyy.MM.dd'
            dayClassName={(date: Date) => {
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
          onClick={handleConfirm}
          disabled={!isFormValid}
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default UpdateCalendarModal;
