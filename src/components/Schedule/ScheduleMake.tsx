import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../styles/Schedule.module.css';
import Image from 'next/image';
import triptuneIcon from '../../../public/assets/icons/ic_triptune.png';

// import { getSchedule, getTravels } from '@/api/scheduleApi';

interface ScheduleMakeProps {
  scheduleData?: {
    travelName: string;
    startDate: Date | null;
    endDate: Date | null;
  };
}

const ScheduleMake = ({ scheduleData }: ScheduleMakeProps) => {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'scheduleTravel';
  
  const [tab, setTab] = useState<'scheduleTravel' | 'travelRoot'>(initialTab as 'scheduleTravel' | 'travelRoot');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ScheduleMakeProps['scheduleData'] | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // getSchedule, getTravels
        // const response = await fetch('/api/schedule');
        // const result = await response.json();
        // setData(result);
        setTimeout(() => {
          setData(scheduleData || { travelName: '', startDate: null, endDate: null });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setData({ travelName: '', startDate: null, endDate: null });
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [scheduleData]);
  
  useEffect(() => {
    setTab(initialTab as 'scheduleTravel' | 'travelRoot');
  }, [initialTab]);
  
  const handleTabChange = (tab: 'scheduleTravel' | 'travelRoot') => {
    setTab(tab);
    setMessage('');
    setErrorMessage('');
    setAlertOpen(false);
  };
  
  const getFormattedDate = (date: Date | null) => {
    return date
      ? date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      : '';
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className={styles.pageContainer}>
      <div>
        <h2 className={styles.detailTitle}>
          <Image src={triptuneIcon} alt="일정만들기" priority />
          일정 만들기
        </h2>
        <div className={styles.inputGroup}>
          <label>여행 이름</label>
          <input
            type="text"
            className={styles.inputField}
            placeholder="여행 이름을 입력해주세요."
            value={data?.travelName || ''}
            onChange={(e) => setData({ ...data, travelName: e.target.value })}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>여행 날짜</label>
          <input
            type="text"
            className={styles.inputField}
            value={`${getFormattedDate(data?.startDate)} ~ ${getFormattedDate(data?.endDate)}`}
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
      {tab === 'scheduleTravel' ? (
        <div className={styles.inputGroup}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="원하는 여행지를 검색하세요"
                style={{
                  width: '450px',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginRight: '10px',
                }}
              />
              <button
                style={{
                  padding: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                돋보기
              </button>
            </div>
            <div>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#eee',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span>사진</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  훈련원공원
                </div>
                <div style={{ color: '#666', marginBottom: '5px' }}>
                  대한민국 / 서울 / 중구
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                  <span style={{ marginLeft: '5px' }}>서울특별시 중구 을지로 227 (을지로5가)</span>
                </div>
              </div>
              <button
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.inputGroup}>
          <>
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#eee',
                border: '1px solid #ccc',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span>사진</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                훈련원공원
              </div>
              <div style={{ color: '#666', marginBottom: '5px' }}>
                대한민국 / 서울 / 중구
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                <span style={{ marginLeft: '5px' }}>서울특별시 중구 을지로 227 (을지로5가)</span>
              </div>
            </div>
            <button
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              추가
            </button>
          </>
        </div>
      )}
      {alertOpen && (
        <div
          className={`${styles.alert} ${alertSeverity === 'success' ? styles.alertSuccess : styles.alertError}`}
        >
          {alertSeverity === 'success' ? message : errorMessage}
        </div>
      )}
    </div>
  );
};

const WrappedScheduleMakePage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ScheduleMake />
  </Suspense>
);

export default WrappedScheduleMakePage;
