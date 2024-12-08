'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import styles from '../../../styles/Schedule.module.css';
import MainLogoImage from '../../../../public/assets/images/로고/triptuneLogo.png';
import ScheduleMake from '@/components/Schedule/ScheduleMake';
import PlacesScheduleMap from '@/components/Schedule/PlacesScheduleMap';
import Chatting from '@/components/Schedule/Chatting';
import InviteModal from '@/components/Schedule/InviteModal';
import { updateExistingSchedule } from '@/api/scheduleApi';
import { useTravelStore } from '@/store/scheduleStore';

export default function ScheduleDetailPage() {
  const { scheduleId } = useParams();
  const router = useRouter();
  const { travelRoute, scheduleDetail, fetchScheduleDetailById } =
    useTravelStore();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  useEffect(() => {
    if (scheduleId) {
      fetchScheduleDetailById(scheduleId as string, 1);
    }
    
  }, [scheduleId, fetchScheduleDetailById]);

  const handleShareClick = () => setIsInviteModalOpen(true);
  const handleCloseModal = () => setIsInviteModalOpen(false);

  const handleSaveSchedule = async () => {
    // TODO : 여행 루트의 값이 없을때도 수정을 해야하는지 ?
    if (!scheduleDetail) return;
    // if (!scheduleDetail || travelRoute.length === 0) return;
    
    const transformedRoute = travelRoute.map((place, index) => ({
      routeOrder: index + 1,
      placeId: place.placeId,
    }));

    const data = {
      scheduleName: scheduleDetail.scheduleName || '',
      startDate: scheduleDetail.startDate || '',
      endDate: scheduleDetail.endDate || '',
      scheduleId: Number(scheduleId),
      travelRoute: transformedRoute,
    };

    const response = await updateExistingSchedule(data);
    if (response.success) {
      router.push('/Schedule');
    } else {
      console.error('일정 저장에 실패했습니다:', response.message);
    }
  };

  return (
    <>
      <Head>
        <title>일정 상세 페이지 - 지도와 함께 만드는 나만의 일정</title>
        <meta
          name='description'
          content='지도를 활용하여 여행지와 일정을 관리하고 저장할 수 있는 페이지입니다. 원하는 위치를 추가하고 일정을 계획해 보세요.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <header className={styles.header}>
        <ul className={styles.headerMenu}>
          <li>
            <Link href='/'>
              <Image
                src={MainLogoImage}
                alt='로고'
                width={183}
                height={57}
              />
            </Link>
          </li>
        </ul>
        <button
          className={styles.scheduleUpdateBtn}
          onClick={handleShareClick}
        >
          공유
        </button>
        <button className={styles.scheduleShareBtn} onClick={handleSaveSchedule}>
          저장
        </button>
      </header>
      <InviteModal isOpen={isInviteModalOpen} onClose={handleCloseModal} />
      <div className={styles.layoutContainer}>
        <div className={styles.leftSection}>
          <ScheduleMake initialTab='scheduleTravel' />
        </div>
        <div className={styles.centerSection}>
          <PlacesScheduleMap />
        </div>
        <div className={styles.rightSection}>
          <Chatting />
        </div>
      </div>
    </>
  );
}
