import React, { useEffect, useState, useCallback } from 'react';
import { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { createNewSchedule } from '@/apis/Schedule/scheduleApi';
import { useTravelStore } from '@/store/scheduleStore';
import Image from 'next/image';
import triptuneIcon from '../../../../public/assets/images/로고/triptuneIcon-removebg.png';
import DateRangePicker from './DateRangePicker';
import {
  ModalOverlay,
  ModalContainer,
  CloseButton,
  DetailTitle,
  InputGroup,
  InputField,
  DatePickerContainer,
  ConfirmButton,
} from './styles';

registerLocale('ko', ko);

/**
 * 일정 생성/수정 모달 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {'create' | 'update'} props.mode - 모달 모드 (생성/수정)
 * @param {string} [props.initialStartDate] - 초기 시작일
 * @param {string} [props.initialEndDate] - 초기 종료일
 * @param {string} [props.travelName] - 여행 이름
 * @param {() => void} props.onClose - 모달 닫기 핸들러
 */
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
    if (mode === 'create') {
      setIsFormValid(
        scheduleName.trim() !== '' && startDate !== null && endDate !== null
      );
    } else {
      setIsFormValid(startDate !== null && endDate !== null);
    }
  }, [startDate, endDate, scheduleName, mode]);

  const handleConfirm = useCallback(async () => {
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
  }, [isFormValid, mode, scheduleName, startDate, endDate, onClose, updateScheduleDetail]);

  const handleDateChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    if (start && end) {
      if (start > end) {
        setStartDate(end);
        setEndDate(start);
      } else {
        setStartDate(start);
        setEndDate(end);
      }
    } else if (start) {
      setStartDate(start);
      setEndDate(null);
    } else if (end) {
      if (!startDate || end > startDate) {
        setEndDate(end);
      } else {
        setStartDate(end);
        setEndDate(startDate);
      }
    }
  }, [startDate]);

  const handleScheduleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduleName(e.target.value);
  }, []);

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="calendar-modal-title">
      <ModalContainer>
        <CloseButton 
          onClick={onClose}
          aria-label="모달 닫기"
        >
          &times;
        </CloseButton>
        <DetailTitle>
          <Image src={triptuneIcon} alt='TripTune 로고' width={40} priority />
          &nbsp; <span id="calendar-modal-title">{mode === 'create' ? '일정 만들기' : '일정 수정'}</span>
        </DetailTitle>
        {mode === 'create' && (
          <InputGroup>
            <label htmlFor="schedule-name">여행 이름</label>
            <InputField
              id="schedule-name"
              type='text'
              placeholder='여행 이름을 입력해주세요.'
              value={scheduleName}
              onChange={handleScheduleNameChange}
              aria-required="true"
              aria-invalid={!scheduleName.trim()}
            />
          </InputGroup>
        )}
        <InputGroup>
          <label>여행 날짜</label>&nbsp;&nbsp;
          <span aria-live="polite">
            {startDate?.toLocaleDateString('ko-KR')} ~{' '}
            {endDate?.toLocaleDateString('ko-KR')}
          </span>
        </InputGroup>
        <DatePickerContainer>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            minDate={today}
            onDateChange={handleDateChange}
          />
        </DatePickerContainer>
        <ConfirmButton 
          onClick={handleConfirm} 
          disabled={!isFormValid}
          aria-label={mode === 'create' ? '일정 생성하기' : '일정 수정하기'}
        >
          {mode === 'create' ? '생성' : '수정'}
        </ConfirmButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CalendarLayout; 