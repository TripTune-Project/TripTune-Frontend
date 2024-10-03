import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../styles/Schedule.module.css';
import Image from 'next/image';
import triptuneIcon from '../../../public/assets/icons/ic_triptune.png';
import searchIcon from '../../../public/assets/icons/ic_search.png';

const ScheduleMake = () => {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'scheduleTravel';
  
  const [tab, setTab] = useState<'scheduleTravel' | 'travelRoot'>(
    initialTab as 'scheduleTravel' | 'travelRoot'
  );
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  
  useEffect(() => {
    setTab(initialTab as 'scheduleTravel' | 'travelRoot');
  }, [initialTab]);
  
  const handleTabChange = (tab: 'scheduleTravel' | 'travelRoot') => {
    setTab(tab);
    setMessage('');
    setErrorMessage('');
    setAlertOpen(false);
  };
  
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  
  const getFormattedDate = (date: Date | null) => {
    return date
      ? date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      : '';
  };
  
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
            />
          </div>
          <div className={styles.inputGroup}>
            <label>여행 날짜</label>
            <input
              type="text"
              className={styles.inputField}
              value={`${getFormattedDate(startDate)} ~ ${getFormattedDate(endDate)}`}
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
        <div>
          <div>
            <input
              type="text"
              placeholder="원하는 여행지를 검색하세요"
            />
            <button>
              <Image
                src={searchIcon}
                alt="돋보기 아이콘"
                width={20}
                height={20}
                style={{ marginLeft: '30px' }}
              />
            </button>
          </div>
          <div>
            <div>사진</div>
            <div>소개</div>
            <div>추가</div>
          </div>
        </div>
      ) : (
        <div className={styles.inputGroup}>
          <div>
            <div>사진</div>
            <div>소개</div>
            <div>추가</div>
          </div>
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
