'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';
import MainLogoImage from '../../../../public/assets/images/로고/triptuneLogo.png';
import ScheduleMake from '@/components/Feature/Schedule/ScheduleMake';
import SchedulePlacesMap from '@/components/Feature/Schedule/SchedulePlacesMap';
import Chatting from '@/components/Feature/Schedule/Chatting';
import InviteModal from '@/components/Feature/Schedule/InviteModal';
import { updateExistingSchedule } from '@/apis/Schedule/scheduleApi';
import { useTravelStore } from '@/store/scheduleStore';
import useAuth from '@/hooks/useAuth';
import LoginModal from '@/components/Common/LoginModal';
import DataLoading from '@/components/Common/DataLoading';

export default function ScheduleDetailPage() {
  const { scheduleId } = useParams();
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { travelRoute, scheduleDetail, fetchScheduleDetailById } =
    useTravelStore();

  useEffect(() => {}, [isAuthenticated, router]);

  useEffect(() => {
    if (scheduleId) {
      fetchScheduleDetailById(scheduleId as string, 1);
    }
  }, [scheduleId, fetchScheduleDetailById]);

  const handleShareClick = () => setIsInviteModalOpen(true);
  const handleCloseModal = () => setIsInviteModalOpen(false);

  const handleSaveSchedule = async () => {
    if (!scheduleDetail) return;

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

  if (isLoading) {
    return <DataLoading />;
  }

  if (!isAuthenticated) {
    return <LoginModal />;
  }

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
                width={184}
                height={58}
                style={{ marginLeft: '118px' }}
                priority
              />
            </Link>
          </li>
        </ul>
        <button className={styles.scheduleUpdateBtn} onClick={handleShareClick}>
          공유
        </button>
        <button
          className={styles.scheduleShareBtn}
          onClick={handleSaveSchedule}
        >
          저장
        </button>
      </header>
      <InviteModal isOpen={isInviteModalOpen} onClose={handleCloseModal} />
      <div className={styles.layoutContainer}>
        <div className={styles.leftSection}>
          <ScheduleMake initialTab='scheduleTravel' />
        </div>
        <div className={styles.centerSection}>
          <SchedulePlacesMap />
        </div>
        <div className={styles.rightSection}>
          <Chatting />
        </div>
      </div>
    </>
  );
}
