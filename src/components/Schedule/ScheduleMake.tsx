import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';
import { useScheduleDetailList } from '@/hooks/useSchedule';
import DataLoading from '@/components/Common/DataLoading';
import ScheduleTravelSearch from '@/components/Schedule/ScheduleTravelSearch';
import ScheduleRoute from '@/components/Schedule/ScheduleRoute';
import CalendarModal from '@/components/Common/CalendarModal';

interface ScheduleDetail {
  scheduleName: string;
  startDate: string;
  endDate: string;
}

interface Place {
  placeId: number;
  placeName: string;
  thumbnailUrl: string | null;
  country: string;
  city: string;
  district: string;
  address: string;
  detailAddress?: string;
  latitude: number;
  longitude: number;
}

interface ScheduleMakeProps {
  onAddMarker: (marker: { lat: number; lng: number }) => void;
}

const ScheduleMake = ({ onAddMarker }: ScheduleMakeProps) => {
  const { scheduleId } = useParams();
  const searchParams = useSearchParams();
  
  const initialTab = searchParams.get('tab') || 'scheduleTravel';
  const [tab, setTab] = useState(initialTab);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [scheduleDetail, setScheduleDetail] = useState<ScheduleDetail | null>(null);
  const [addedPlaces, setAddedPlaces] = useState<Place[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  const scheduleDetailQuery = useScheduleDetailList(
    Number(scheduleId),
    currentPage,
    scheduleDetail === null
  );
  
  useEffect(() => {
    if (scheduleDetailQuery.isSuccess && scheduleDetailQuery.data?.data) {
      const { scheduleName, startDate, endDate } = scheduleDetailQuery.data.data;
      setScheduleDetail({
        scheduleName: scheduleName || '',
        startDate: startDate || '',
        endDate: endDate || '',
      });
    }
    return () => {
      setScheduleDetail(null);
    };
  }, [scheduleDetailQuery.isSuccess, scheduleDetailQuery.data]);
  
  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setCurrentPage(1);
  };
  
  const handleScheduleDetailChange = (field: string, value: string) => {
    setScheduleDetail((prevState) => ({
      ...prevState,
      [field]: value ?? '',
    }));
  };
  
  const handleAddMarker = (place: Place) => {
    setAddedPlaces((prevPlaces) =>
      prevPlaces.some((p) => p.placeId === place.placeId)
        ? prevPlaces
        : [...prevPlaces, place]
    );
  };
  
  const handleModalSubmit = (name: string, startDate: string, endDate: string) => {
    setScheduleDetail((prev) => ({
      ...prev!,
      startDate,
      endDate,
    }));
    setShowModal(false);
  };
  
  if (scheduleDetailQuery.isLoading || scheduleDetail === null) {
    return <DataLoading />;
  }
  
  if (scheduleDetailQuery.error) {
    return <p>데이터를 불러오는데 오류가 발생했습니다.</p>;
  }
  
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.detailTitle}>일정 만들기</h1>
      <div className={styles.inputGroup}>
        <label>여행 이름</label>
        <input
          type='text'
          className={styles.inputField}
          value={scheduleDetail?.scheduleName || ''}
          placeholder={'여행 이름'}
          onChange={(e) => handleScheduleDetailChange('scheduleName', e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>여행 날짜</label>
        <input
          type='text'
          className={styles.inputField}
          value={`${scheduleDetail?.startDate ?? ''} ~ ${scheduleDetail?.endDate ?? ''}`}
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
          className={`${styles.tabButton} ${tab === 'scheduleTravel' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('scheduleTravel')}
        >
          여행지
        </button>
        <button
          className={`${styles.tabButton} ${tab === 'travelRoot' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('travelRoot')}
        >
          여행 루트
        </button>
      </div>
      {tab === 'scheduleTravel' ? (
        <ScheduleTravelSearch onAddMarker={handleAddMarker} />
      ) : (
        <ScheduleRoute places={addedPlaces} />
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
