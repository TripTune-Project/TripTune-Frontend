import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Schedule.module.css';
import { ko } from 'date-fns/locale';

registerLocale('ko', ko);

interface CalendarModalProps {
  initialStartDate: string;
  initialEndDate: string;
  onClose: () => void;
  onSubmit: (name: string, startDate: string, endDate: string) => void;
}

const CalendarModal = ({
  initialStartDate,
  initialEndDate,
  onClose,
  onSubmit,
}: CalendarModalProps) => {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(
    initialStartDate ? new Date(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialEndDate ? new Date(initialEndDate) : today
  );
  const [travelName, setTravelName] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    today.setHours(0, 0, 0, 0);

    setIsFormValid(
      travelName.trim() !== '' && endDate !== null && endDate > today
    );
  }, [travelName, startDate, endDate]);

  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleConfirm = () => {
    if (isFormValid) {
      onSubmit(
        travelName,
        startDate ? formatDateToString(startDate) : '',
        formatDateToString(endDate!)
      );
      onClose();
    } else {
      console.error('모든 필드를 올바르게 입력해야 합니다.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
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
          // TODO : 날짜 변경 안되고 있음
          disabled={!isFormValid}
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default CalendarModal;
