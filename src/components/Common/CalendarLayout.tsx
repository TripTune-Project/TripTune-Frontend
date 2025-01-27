import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/Schedule.module.css';
import { ko } from 'date-fns/locale';
import { createNewSchedule } from '@/apis/Schedule/scheduleApi';
import { useTravelStore } from '@/store/scheduleStore';
import { isValidDateForCreation, isValidDateForUpdate } from '@/utils';
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
    const isValid =
      mode === 'create'
        ? isValidDateForCreation(startDate, endDate)
        : isValidDateForUpdate(endDate);

    setIsFormValid(
      mode === 'create' ? scheduleName.trim() !== '' && isValid : isValid
    );
  }, [startDate, endDate, scheduleName, mode]);

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

  const handleConfirm = async () => {
    if (!isFormValid) {
      console.error(
        mode === 'create'
          ? '모든 필드를 올바르게 입력해야 합니다.'
          : '종료 날짜는 오늘 이후여야 합니다.'
      );
      return;
    }

    if (mode === 'create') {
      const scheduleData = {
        scheduleName,
        startDate: startDate?.toISOString() || '',
        endDate: endDate?.toISOString() || '',
      };
      try {
        const response = await createNewSchedule(scheduleData);
        if (response && response.data) {
          const scheduleId = response.data.scheduleId;
          onClose();
          window.location.href = `/Schedule/${scheduleId}`;
        }
      } catch (error) {
        console.error('일정 생성 실패:', error);
      }
    } else {
      updateScheduleDetail({
        startDate: startDate?.toISOString() || '',
        endDate: endDate?.toISOString() || '',
      });
      console.log('일정이 수정되었습니다!');
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.detailTitle}>
          <Image src={triptuneIcon} alt='일정만들기' width={'40'} priority />
          &nbsp; {mode === 'create' ? '일정 만들기' : '일정 수정'}
        </h2>
        {mode === 'create' && (
          <div className={styles.inputGroup}>
            <>
              <label>여행 이름</label>
              <input
                type='text'
                className={styles.inputField}
                placeholder='여행 이름을 입력해주세요.'
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
              />
            </>
          </div>
        )}
        <div className={styles.inputGroup}>
          <label>여행 날짜</label>&nbsp;&nbsp;
          {formatDateToKoreanWithDay(startDate)} ~{' '}
          {formatDateToKoreanWithDay(endDate)}
        </div>
        <div className={styles.datePickerContainer}>
          <DatePicker
            locale='ko'
            selected={startDate || undefined}
            onChange={(dates: [Date | null, Date | null]) => {
              let [start, end] = dates;
              if (start && end && start > end) {
                [start, end] = [end, start];
              }
              if (!start && end) {
                start = end;
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
              const isPast = date < today.setHours(0, 0, 0, 0);
              const day = date.getDay();
              
              if (day === 0) return isPast ? styles.pastSunday : styles.sunday;
              if (day === 6) return isPast ? styles.pastSaturday : styles.saturday;
              return "";
            }}
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
