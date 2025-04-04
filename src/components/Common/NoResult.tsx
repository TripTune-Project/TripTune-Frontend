import React from 'react';
import Image from 'next/image';
import AlertIcon from '../../../public/assets/images/여행지 탐색/홈화면/alertIcon.png';

export default function NoResultLayout() {
  const pathname = window.location.pathname;
  const isTravelPage = pathname.includes('/Travel');
  const isBookmarkPage = pathname.includes('/MyPage');
  const isSchedulePage = pathname.includes('/Schedule') || (!isTravelPage && !isBookmarkPage);
  
  let containerStyles: React.CSSProperties = {};
  
  if (isTravelPage) {
    containerStyles = {
      width: '35vw',
      height: '75vh',
    };
  } else if (isBookmarkPage) {
    containerStyles = {
      width: '948px',
      height: '524px',
    };
  } else if (isSchedulePage) {
    containerStyles = {
      width: '1297px',
      height: '600px',
      marginLeft: '-208px',
    };
  }
  
  const styles = {
    noScheduleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#555',
      border: '1px solid #d9d9d9',
      backgroundColor: '#ffffff',
      ...containerStyles,
    } as React.CSSProperties,
    noResults: {
      color: '#555',
      fontSize: '16px',
      textAlign: 'center',
      margin: '20px 0',
      padding: '10px',
    } as React.CSSProperties,
    noText: {
      marginTop: '60px',
      color: '#666',
      textAlign: 'center',
      fontSize: '20px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: 'normal',
    } as React.CSSProperties,
  };
  
  return (
    <div style={styles.noScheduleContainer}>
      <p style={styles.noResults}>
        <Image
          src={AlertIcon}
          alt="no-schedule-root"
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
