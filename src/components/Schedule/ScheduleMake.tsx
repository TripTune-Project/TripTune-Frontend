import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';
import { getSchedule, getTravels } from '@/api/scheduleApi';

const ScheduleMake = () => {
  const searchParams = useSearchParams();
  const { scheduleId } = useParams();
  const initialTab = searchParams.get('tab') || 'scheduleTravel';
  
  const [tab, setTab] = useState<'scheduleTravel' | 'travelRoot'>(initialTab as 'scheduleTravel' | 'travelRoot');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (scheduleId) {
        try {
          setIsLoading(true);
          const scheduleData = await getSchedule(Number(scheduleId), 1);
          setData(scheduleData);
        } catch (error) {
          console.error('Failed to fetch schedule data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [scheduleId]);
  
  const handleTabChange = (newTab: 'scheduleTravel' | 'travelRoot') => {
    setTab(newTab);
  };
  
  const handleTravelSearch = async () => {
    if (scheduleId) {
      try {
        await getTravels(Number(scheduleId), 1);
      } catch (error) {
        console.error('Failed to fetch travels:', error);
      }
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className={styles.pageContainer}>
      <div>
        <h2 className={styles.detailTitle}>일정 만들기</h2>
        <div className={styles.inputGroup}>
          <label>여행 이름</label>
          <input
            type="text"
            className={styles.inputField}
            placeholder="여행 이름을 입력해주세요."
            value={data?.travelName || ''}
            readOnly
          />
        </div>
        <div className={styles.inputGroup}>
          <label>여행 날짜</label>
          <input
            type="text"
            className={styles.inputField}
            value={`${data?.startDate} ~ ${data?.endDate}`}
            readOnly
          />
        </div>
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
      {tab === 'scheduleTravel' && (
        <div className={styles.travelSearchContainer}>
          <input type="text" placeholder="원하는 여행지를 검색하세요" />
          <button onClick={handleTravelSearch}>돋보기</button>
        </div>
      )}
    </div>
  );
};

export default ScheduleMake;
