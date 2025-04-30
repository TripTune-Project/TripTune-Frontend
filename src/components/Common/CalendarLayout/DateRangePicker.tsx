import React, { memo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

/**
 * 날짜 범위 선택 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Date | null} props.startDate - 시작일
 * @param {Date | null} props.endDate - 종료일
 * @param {Date} props.minDate - 선택 가능한 최소 날짜
 * @param {(dates: [Date | null, Date | null]) => void} props.onDateChange - 날짜 변경 핸들러
 */
interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  minDate: Date;
  onDateChange: (dates: [Date | null, Date | null]) => void;
}

const DateRangePicker = ({
  startDate,
  endDate,
  minDate,
  onDateChange,
}: DateRangePickerProps) => {
  return (
    <DatePicker
      selected={startDate || undefined}
      onChange={onDateChange}
      startDate={startDate || undefined}
      endDate={endDate || undefined}
      minDate={minDate}
      selectsRange
      locale={ko}
      dateFormat="yyyy/MM/dd"
      placeholderText="여행 기간을 선택해주세요"
      aria-label="여행 기간 선택"
      monthsShown={2}
      showPopperArrow={false}
      calendarClassName="custom-calendar"
      popperClassName="custom-popper"
      popperPlacement="bottom-start"
      popperModifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]}
    />
  );
};

export default memo(DateRangePicker); 