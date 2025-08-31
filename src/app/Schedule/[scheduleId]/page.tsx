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

/**
 * 일정 상세 페이지 컴포넌트
 * 특정 일정의 상세 정보를 보여주고 편집할 수 있는 페이지
 */
export default function ScheduleDetailPage() {
  // useParams의 반환 타입을 명시적으로 지정하여 타입 에러 해결
  const params = useParams();
  const scheduleId = params?.scheduleId as string;
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

  const { travelRoute, scheduleDetail, fetchScheduleDetailById, resetTravelRoute } =
    useTravelStore();

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (scheduleId) {
        try {
          setIsLoadingData(true);
          await fetchScheduleDetailById(scheduleId, 1);
          // 일정 데이터 로드 성공 후 채팅 데이터 로드 시작
          setIsChatLoading(true);
        } catch (error) {
          setIsError(true);
          if (
            error instanceof Error &&
            error.message === '일정이 존재하지 않습니다.'
          ) {
            setAlertMessage('일정이 존재하지 않습니다.');
            setAlertSeverity('error');
            setAlertOpen(true);
            // 메시지가 표시된 후 3초 뒤에 뒤로가기
            setTimeout(() => {
              router.back();
            }, 3000);
          } else {
            setAlertMessage('일정을 불러오는 중 오류가 발생했습니다.');
            setAlertSeverity('error');
            setAlertOpen(true);
            // 메시지가 표시된 후 3초 뒤에 뒤로가기
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

    // 페이지를 떠날 때 여행 루트 데이터 초기화
    return () => {
      resetTravelRoute();
    };
  }, [scheduleId, fetchScheduleDetailById, router, resetTravelRoute]);

  useEffect(() => {
    // 페이지 진입 시 body 스크롤 막기
    document.body.style.overflow = 'hidden';
    return () => {
      // 페이지 벗어날 때 원복
      document.body.style.overflow = '';
    };
  }, []);

  // 공유 모달 열기/닫기 핸들러
  const handleShareClick = () => setIsInviteModalOpen(true);
  const handleCloseModal = () => setIsInviteModalOpen(false);

  // 알림창 닫기 핸들러
  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  // 일정 저장 핸들러
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

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <DataLoading />;
  }

  // 인증되지 않았을 때 로그인 모달 표시
  if (!isAuthenticated) {
    return <LoginModal />;
  }

  // 오류 발생 시 에러 화면 표시
  if (isError) {
    return (
      <div className={styles.errorContainer}>
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

  // 데이터 로딩 중일 때 로딩 화면 표시
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
        <button className={styles.scheduleShareBtn} onClick={handleShareClick}>
          공유
        </button>
        <button
          className={styles.scheduleUpdateBtn}
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
