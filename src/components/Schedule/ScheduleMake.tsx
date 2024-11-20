'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/Schedule.module.css';
import ScheduleTravelSearch from '@/components/Schedule/ScheduleTravelSearch';
import ScheduleRoute from '@/components/Schedule/ScheduleRoute';
import CalendarModal from '@/components/Common/CalendarModal';
import { fetchScheduleDetail } from '@/api/scheduleApi';
import { ScheduleType, Place } from '@/types/scheduleType';
import { useTravelStore } from '@/store/scheduleStore';

interface ScheduleMakeProps {
  scheduleId: number;
  initialTab: string;
  onAddMarker: (marker: { lat: number; lng: number }) => void;
}

const ScheduleMake = ({
                        scheduleId,
                        initialTab,
                        onAddMarker,
                      }: ScheduleMakeProps) => {
  const [tab, setTab] = useState(initialTab);
  const [currentPage, setCurrentPage] = useState(1);
  const [scheduleDetail, setScheduleDetail] = useState<ScheduleType | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  
  const { addedPlaces, addPlace, removePlace, movePlace } = useTravelStore();
  
  useEffect(() => {
    const loadScheduleDetail = async () => {
      const result = await fetchScheduleDetail(scheduleId, currentPage);
      if (result.success) {
        setScheduleDetail(result.data as any);
      } else {
        console.error('Failed to load schedule detail:', result.message);
      }
    };
    
    loadScheduleDetail();
  }, [scheduleId, currentPage]);
  
  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setCurrentPage(1);
  };
  
  const handleScheduleDetailChange = (field: string, value: string) => {
    setScheduleDetail((prevState) => ({
      ...(prevState || { scheduleName: '', startDate: '', endDate: '' }),
      [field]: value ?? '',
    }));
  };
  
  const handleAddMarker = (place: Place) => {
    const marker = { lat: place.latitude, lng: place.longitude };
    onAddMarker(marker);
    addPlace(place);
  };
  
  const handleModalSubmit = (
    name: string,
    startDate: string,
    endDate: string
  ) => {
    setScheduleDetail((prev) => ({
      ...prev!,
      startDate,
      endDate,
    }));
    setShowModal(false);
  };
  
  const ScheduleRouteWrapper = () => {
    return (
      <ScheduleRoute
        places={addedPlaces}
        onMovePlace={movePlace}
        onDeletePlace={removePlace}
      />
    );
  };
  
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.detailTitle}>일정 만들기</h1>
      <div className={styles.inputGroup}>
        <label>여행 이름</label>
        <input
          type="text"
          className={styles.inputField}
          value={scheduleDetail?.scheduleName || ''}
          placeholder={'여행 이름을 입력해주세요.'}
          onChange={(e) =>
            handleScheduleDetailChange('scheduleName', e.target.value)
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>여행 날짜</label>
        <input
          type="text"
          className={styles.inputField}
          value={`${scheduleDetail?.startDate || ''} ~ ${
            scheduleDetail?.endDate || ''
          }`}
          placeholder={'시작일 ~ 종료일'}
          onChange={(e) => {
            const [startDate, endDate] = e.target.value.split(' ~ ');
            handleScheduleDetailChange('startDate', startDate);
            handleScheduleDetailChange('endDate', endDate);
          }}
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
      {tab === 'scheduleTravel' ? (
        <ScheduleTravelSearch onAddMarker={handleAddMarker} />
      ) : (
        <ScheduleRouteWrapper />
      )}
      {showModal && (
        <CalendarModal
          initialStartDate={scheduleDetail?.startDate || ''}
          initialEndDate={scheduleDetail?.endDate || ''}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default ScheduleMake;
