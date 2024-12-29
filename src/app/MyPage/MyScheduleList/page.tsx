'use client';

import React, { useState } from 'react';
import styles from '@/styles/Mypage.module.css';

const TripStatusEdit = () => {
  const [status, setStatus] = useState('여행 전');
  const [departureDate, setDepartureDate] = useState('');
  const [tripTitle, setTripTitle] = useState('');

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleEdit = () => {
    alert(`상태: ${status}\n출발일: ${departureDate}\n제목: ${tripTitle}`);
    // 추가 로직 작성 가능
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>여행 상태 관리</h2>
      <div className={styles.statusButtons}>
        <button
          className={`${styles.statusButton} ${
            status === '여행 전' ? styles.activeGreen : ''
          }`}
          onClick={() => handleStatusChange('여행 전')}
        >
          여행 전
        </button>
        <button
          className={`${styles.statusButton} ${
            status === '여행 당일' ? styles.activeBlue : ''
          }`}
          onClick={() => handleStatusChange('여행 당일')}
        >
          여행 당일
        </button>
        <button
          className={`${styles.statusButton} ${
            status === '여행 후' ? styles.activeRed : ''
          }`}
          onClick={() => handleStatusChange('여행 후')}
        >
          여행 후
        </button>
      </div>
      <div className={styles.inputGroup}>
        <input
          type='date'
          placeholder='여행 출발일'
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className={styles.input}
        />
        <input
          type='text'
          placeholder='여행 제목'
          value={tripTitle}
          onChange={(e) => setTripTitle(e.target.value)}
          className={styles.input}
        />
      </div>
      <button onClick={handleEdit} className={styles.editButton}>
        편집하기
      </button>
    </div>
  );
};

export default TripStatusEdit;
