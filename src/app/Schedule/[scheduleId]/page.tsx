'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import PlacesScheduleMap from '@/components/Schedule/PlacesScheduleMap';
import ScheduleMake from '@/components/Schedule/ScheduleMake';
import styles from '../../../styles/Schedule.module.css';
import Chatting from '@/components/Schedule/Chatting';
import useAuth from '@/hooks/useAuth';

export default function ScheduleDetail() {
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleAddMarker = (marker: { lat: number; lng: number }) => {
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  return (
    <>
      <Head>
        <title>일정 상세 페이지 - 지도와 함께 만드는 나만의 일정</title>
        <meta
          name='description'
          content='지도를 활용하여 여행지와 일정을 관리하고 저장할 수 있는 페이지입니다. 원하는 위치를 추가하고 일정을 계획해 보세요.'
        />
        <meta
          name='keywords'
          content='일정 만들기, 지도 일정 관리, 여행 계획, 일정 저장'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          property='og:title'
          content='일정 상세 페이지 - 지도와 함께 만드는 나만의 일정'
        />
        <meta
          property='og:description'
          content='지도를 활용해 위치를 추가하며 나만의 일정을 만들어보세요. 여행을 보다 체계적으로 계획할 수 있습니다.'
        />
        <meta property='og:type' content='website' />
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <button className={styles.scheduleUpdateBtn}>일정 만들기 저장</button>;
      <div className={styles.layoutContainer}>
        <div className={styles.leftSection}>
          <ScheduleMake onAddMarker={handleAddMarker} />
        </div>
        <div className={styles.centerSection}>
          <PlacesScheduleMap markers={markers} />
        </div>
        <div className={styles.rightSection}>
          <Chatting />
        </div>
      </div>
    </>
  );
}
