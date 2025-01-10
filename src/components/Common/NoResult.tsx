import React from 'react';
import Image from 'next/image';
import AlertIcon from '../../../public/assets/images/여행지 탐색/홈화면/alertIcon.png';

export default function NoResultLayout() {
  const styles: { [key: string]: React.CSSProperties } = {
    noScheduleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '30px',
      color: '#555',
      width: '90vw',
      height: '559px',
      flexShrink: 0,
      border: '1px solid #d9d9d9',
      backgroundColor: '#ffffff',
    },
    noResults: {
      color: '#555',
      fontSize: '16px',
      textAlign: 'center',
      margin: '20px 0',
      padding: '10px',
    },
    noText: {
      marginTop: '60px',
      color: '#666',
      textAlign: 'center',
      fontSize: '20px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: 'normal',
    },
  };

  return (
    <div style={styles.noScheduleContainer}>
      <p style={styles.noResults}>
        <Image
          src={AlertIcon}
          alt={'no-schedule-root'}
          width={80}
          height={80}
          style={{ marginLeft: '120px' }}
        />
        <div style={styles.noText}>검색 결과가 없습니다.</div>
        <br />
        <p>검색어의 철자와 띄어쓰기가 정확한지 확인해주세요.</p>
      </p>
    </div>
  );
}
