'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/Schedule.module.css';
import ScheduleTravelSearch from '@/components/Feature/Schedule/ScheduleTravelSearch';
import ScheduleRoute from '@/components/Feature/Schedule/ScheduleRoute';
import UpdateCalendarModal from '@/components/Feature/Schedule/UpdateCalendarModal';
import { useParams } from 'next/navigation';
import { useTravelStore } from '@/store/scheduleStore';
import dateIcon from '../../../../public/assets/images/일정 만들기/일정 저장 및 수정/dateIcon.png';
import Image from 'next/image';

interface ScheduleMakeProps {
  initialTab: string;
}

const ScheduleMake = ({ initialTab }: ScheduleMakeProps) => {
  const { scheduleId } = useParams() as { scheduleId: string };
  const { scheduleDetail, fetchScheduleDetailById, updateScheduleDetail } =
    useTravelStore();

  const [tab, setTab] = useState(initialTab);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (scheduleId) {
      fetchScheduleDetailById(scheduleId as string, 1);
    }
  }, [scheduleId, fetchScheduleDetailById]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
  };

  const formatDateToKoreanWithDay = (date: string): string => {
    if (!date) return '';
    const parsedDate = new Date(date);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    })
      .format(parsedDate)
      .replace(/\./g, '.')
      .replace(' ', '');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.inputGroup}>
        <label>여행 이름</label>
        <input
          type='text'
          className={styles.inputField}
          value={scheduleDetail?.scheduleName || ''}
          placeholder='여행 이름을 입력해주세요.'
          onChange={(e) =>
            updateScheduleDetail({
              ...scheduleDetail,
              scheduleName: e.target.value,
            })
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>여행 날짜</label>
        <input
          type='text'
          className={styles.inputField}
          value={`${formatDateToKoreanWithDay(scheduleDetail?.startDate || '')} ~ ${formatDateToKoreanWithDay(
            scheduleDetail?.endDate || ''
          )}`}
          placeholder='시작일 ~ 종료일'
          onClick={() => setShowModal(true)}
          readOnly
        />
        <Image
          src={dateIcon}
          width={19}
          height={22}
          alt='dateIcon'
          onClick={() => setShowModal(true)}
        />
      </div>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            tab === 'scheduleTravel' ? styles.activeTab : ''
          }`}
          onClick={() => handleTabChange('scheduleTravel')}
        >
          여행지
        </button>
        <button
          className={`${styles.tabButton} ${
            tab === 'travelRoot' ? styles.activeTab : ''
          }`}
          onClick={() => handleTabChange('travelRoot')}
        >
          여행 루트
        </button>
      </div>
      {tab === 'scheduleTravel' ? <ScheduleTravelSearch /> : <ScheduleRoute />}
      {showModal && (
        <UpdateCalendarModal
          initialStartDate={scheduleDetail?.startDate || ''}
          initialEndDate={scheduleDetail?.endDate || ''}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ScheduleMake;
