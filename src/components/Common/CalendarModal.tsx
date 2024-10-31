import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Schedule.module.css';
import { ko } from 'date-fns/locale';
import { createNewSchedule } from '@/api/scheduleApi';
import { useRouter } from 'next/navigation';

registerLocale('ko', ko);

interface ScheduleModalProps {
  onClose: () => void;
}

const ScheduleModal = ({ onClose }: ScheduleModalProps) => {
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
        onClose();
        router.push(`/Schedule/${scheduleId}`);
      } else {
        console.error('일정 생성 실패');
      }
    } catch (error) {
      console.error('일정 생성 중 오류 발생:', error);
    }
  };

  return (
    <>
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
    </>
  );
};

export default ScheduleModal;
