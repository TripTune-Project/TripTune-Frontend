import React from 'react';
import Image from 'next/image';
import AlertIcon from '../../../public/assets/images/여행지 탐색/홈화면/alertIcon.png';

export default function NoResultLayout() {
  const pathname = window.location.pathname;
  const isTravelPage = pathname.includes('/Travel');
  const isBookmarkPage = pathname.includes('/MyPage');
  const isSchedulePage =
    pathname.includes('/Schedule') || (!isTravelPage && !isBookmarkPage);

  const getContainerStyles = () => {
    const baseStyles = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#555',
      border: '1px solid #d9d9d9',
      backgroundColor: '#ffffff',
      width: '100%',
      height: 'auto',
      minHeight: '300px',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties;

    if (isTravelPage) {
      return {
        ...baseStyles,
        maxWidth: '35vw',
        minHeight: '75vh',
      };
    }
    if (isBookmarkPage) {
      return {
        ...baseStyles,
        maxWidth: '948px',
        minHeight: '524px',
      };
    }
    if (isSchedulePage) {
      return {
        ...baseStyles,
        maxWidth: '1297px',
        minHeight: '600px',
        margin: '0 auto',
      };
    }

    return baseStyles;
  };

  return (
    <div 
      role="alert" 
      aria-label="검색 결과 없음" 
      style={getContainerStyles()}
    >
      <Image
        src={AlertIcon}
        alt="알림 아이콘"
        width={48}
        height={48}
        style={{ marginBottom: '1rem' }}
      />
      <h2 style={{ 
        fontSize: 'calc(var(--base-font-size) * 1.5)',
        fontWeight: 600,
        marginBottom: '0.5rem',
        textAlign: 'center'
      }}>
        검색 결과가 없습니다
      </h2>
      <p style={{ 
        fontSize: 'calc(var(--base-font-size) * 1)',
        color: '#666',
        textAlign: 'center'
      }}>
        다른 검색어로 다시 시도해보세요
      </p>
    </div>
  );
}
