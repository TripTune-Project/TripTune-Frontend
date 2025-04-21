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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ScheduleDetailPage() {
  const { scheduleId } = useParams();
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'error' | 'success' | 'info' | 'warning'
  >('error');
  const [isError, setIsError] = useState(false);

  const { travelRoute, scheduleDetail, fetchScheduleDetailById } =
    useTravelStore();

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (scheduleId) {
        try {
          setIsLoadingData(true);
          await fetchScheduleDetailById(scheduleId as string, 1);
          // 일정 데이터 로드 성공 후 채팅 데이터 로드 시작
          setIsChatLoading(true);
        } catch (error) {
          setIsError(true);
          if (
            error instanceof Error &&
            error.message === '일정이 존재하지 않습니다.'
          ) {
            setAlertMessage(
              '일정이 존재하지 않습니다. 이전 페이지로 이동합니다.'
            );
            setAlertSeverity('error');
            setAlertOpen(true);
            setTimeout(() => {
              router.back();
            }, 3000);
          } else {
            setAlertMessage(
              '일정을 불러오는 중 오류가 발생했습니다. 이전 페이지로 이동합니다.'
            );
            setAlertSeverity('error');
            setAlertOpen(true);
            setTimeout(() => {
              router.back();
            }, 3000);
          }
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    fetchScheduleData();
  }, [scheduleId, fetchScheduleDetailById, router]);

  const handleShareClick = () => setIsInviteModalOpen(true);
  const handleCloseModal = () => setIsInviteModalOpen(false);

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

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

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <DataLoading />
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleAlertClose}
            severity={alertSeverity}
            sx={{ width: '100%' }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  }

  if (isLoadingData) {
    return <DataLoading />;
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
          {isChatLoading ? (
            <Chatting
              onError={(error) => {
                setAlertMessage(error);
                setAlertSeverity('error');
                setAlertOpen(true);
              }}
            />
          ) : (
            <div className={styles.chatLoading}>
              <DataLoading />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
