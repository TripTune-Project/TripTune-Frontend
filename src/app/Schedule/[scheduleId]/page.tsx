'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import PlacesScheduleMap from '@/components/Schedule/PlacesScheduleMap';
import ScheduleMake from '@/components/Schedule/ScheduleMake';
import InviteModal from '@/components/Schedule/InviteModal';
import styles from '../../../styles/Schedule.module.css';
import Chatting from '@/components/Schedule/Chatting';
import useAuth from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import { updateExistingSchedule } from '@/api/scheduleApi';
import { ScheduleDetail } from '@/types/scheduleType';
import Link from 'next/link';
import Image from 'next/image';
import MainLogoImage from '../../../../public/assets/images/로고/triptuneLogo.png';

export default function ScheduleDetailPage() {
  const {scheduleId} = useParams();
  const router = useRouter();
  const [scheduleData, setScheduleData] = useState<ScheduleDetail | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { checkAuthStatus } = useAuth();
  
  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus();
      document.body.classList.add('no_scroll');
    };
    checkAuth();
    
    return () => {
      document.body.classList.remove('no_scroll');
    };
  }, [checkAuthStatus]);
  
  const handleShareClick = () => {
    setIsInviteModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  };
  
  // TODO : 기본 > 여행 경로 순위 데이터 저장 훈련
  const handleSaveSchedule = async () => {
    // if (!scheduleData) return;
    
    const updatedScheduleData: ScheduleDetail =
      {
        scheduleId: scheduleId,
        scheduleName: scheduleData?.scheduleName,
        startDate: scheduleData?.startDate,
        endDate: scheduleData?.endDate,
        travelRoute: [
          {
            'routeOrder': 1,
            'placeId': 1,
          },
          {
            'routeOrder': 2,
            'placeId': 35,
          },
        ],
      };
    
    const response = await updateExistingSchedule(updatedScheduleData);
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
          name="description"
          content="지도를 활용하여 여행지와 일정을 관리하고 저장할 수 있는 페이지입니다. 원하는 위치를 추가하고 일정을 계획해 보세요."
        />
        <meta
          name="keywords"
          content="일정 만들기, 지도 일정 관리, 여행 계획, 일정 저장"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="일정 상세 페이지 - 지도와 함께 만드는 나만의 일정"
        />
        <meta
          property="og:description"
          content="지도를 활용해 위치를 추가하며 나만의 일정을 만들어보세요. 여행을 보다 체계적으로 계획할 수 있습니다."
        />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <header className={styles.header}>
        <ul className={styles.headerMenu}>
          <li>
            <Link href="/">
              <Image
                src={MainLogoImage}
                alt="로고"
                className={styles.logo}
                width={183}
                height={57}
                priority
              />
            </Link>
          </li>
        </ul>
        <button
          className={styles.scheduleUpdateBtn}
          onClick={handleSaveSchedule}
        >
          저장
        </button>
        <button className={styles.scheduleShareBtn} onClick={handleShareClick}>
          공유
        </button>
      </header>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseModal}
      />
      <div className={styles.layoutContainer}>
        <div className={styles.leftSection}>
          <ScheduleMake initialTab="scheduleTravel" />
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
