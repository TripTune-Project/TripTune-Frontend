'use client';

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '@/styles/Schedule.module.css';
import DataLoading from '@/components/Common/DataLoading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ScheduleList, ApiResponse, Schedule } from '@/types/scheduleType';
import ScheduleImage from '../../../public/assets/images/일정 만들기/일정 목록 조회/computer.png';
import NoscheduleIcon from '../../../public/assets/images/일정 만들기/일정 목록 조회/scheduleIcon.png';
import searchIcon from '../../../public/assets/images/일정 만들기/일정 목록 조회/searchIcon.png';
import useAuth from '@/hooks/useAuth';
import {
  useScheduleList,
  useSharedScheduleList,
  useScheduleListSearch,
} from '@/hooks/useSchedule';
import { deleteSchedule } from '@/apis/Schedule/scheduleApi';
import { leaveSchedule } from '@/apis/Schedule/attendeeApi';
import DeleteModal from '@/components/Feature/Schedule/DeleteModal';
import moreBtn from '../../../public/assets/images/일정 만들기/일정 목록 조회/moreBtn.png';
import LoginModal from '@/components/Common/LoginModal';
import CalendarLayout from '@/components/Common/CalendarLayout';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import NoResultLayout from '@/components/Common/NoResult';

/**
 * SchedulePage 컴포넌트 - 사용자의 일정 목록을 표시하는 페이지
 */
export default function SchedulePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDeleteMenu, setActiveDeleteMenu] = useState<number | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'share'>('all');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9 ]*$/;

    if (regex.test(input)) {
      setSearchKeyword(input);
      if (!input.trim()) {
        setIsSearching(false);
      }
    } else {
      setAlertMessage('특수문자는 사용할 수 없습니다. 다른 검색어를 입력해 주세요.');
      setAlertSeverity('warning');
      setAlertOpen(true);
    }
  };

  const handleSearchClick = () => {
    if (searchKeyword.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  const {
    data: allScheduleData,
    isLoading: isAllScheduleLoading,
    isError: isAllScheduleError,
    fetchNextPage: fetchNextAllPage,
    hasNextPage: hasNextAllPage,
    isFetchingNextPage: isFetchingNextAllPage,
  } = useScheduleList(selectedTab === 'all' && !isSearching && !!isAuthenticated);

  const {
    data: sharedScheduleData,
    isLoading: isSharedScheduleLoading,
    isError: isSharedScheduleError,
    fetchNextPage: fetchNextSharedPage,
    hasNextPage: hasNextSharedPage,
    isFetchingNextPage: isFetchingNextSharedPage,
  } = useSharedScheduleList(selectedTab === 'share' && !isSearching && !!isAuthenticated);

  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = useScheduleListSearch(searchKeyword, selectedTab, isSearching && !!isAuthenticated);

  const fetchNextPage = isSearching
    ? fetchNextSearchPage
    : selectedTab === 'all'
      ? fetchNextAllPage
      : fetchNextSharedPage;

  const hasNextPage = isSearching
    ? hasNextSearchPage
    : selectedTab === 'all'
      ? hasNextAllPage
      : hasNextSharedPage;

  const isFetchingNextPage = isSearching
    ? isFetchingNextSearchPage
    : selectedTab === 'all'
      ? isFetchingNextAllPage
      : isFetchingNextSharedPage;

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    });

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isSearching, selectedTab]);

  useEffect(() => {
    if (!isAuthenticated) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAllScheduleError || isSharedScheduleError) {
      setAlertMessage('로그인이 필요한 서비스입니다.');
      setAlertSeverity('warning');
      setAlertOpen(true);
    }
  }, [isAllScheduleError, isSharedScheduleError]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleToggleDeleteMenu = (
    scheduleId: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    setActiveDeleteMenu((prevId) =>
      prevId === scheduleId ? null : scheduleId,
    );
  };

  const handleDeleteConfirmation = async () => {
    if (selectedScheduleId) {
      try {
        const response = await deleteSchedule(selectedScheduleId);
        if (response.success) {
          setAlertMessage('일정이 성공적으로 삭제되었습니다.');
          setAlertSeverity('success');
          setAlertOpen(true);
          window.location.reload();
        } else {
          setAlertMessage('일정 삭제 중 오류가 발생했습니다.');
          setAlertSeverity('error');
          setAlertOpen(true);
        }
      } catch (error) {
        setAlertMessage('서버 내부 오류가 발생하였습니다.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    }
  };

  const handleDeleteSchedule = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleLeaveSchedule = async (scheduleId: number) => {
    if (!scheduleId) return;

    try {
      const response = await leaveSchedule(scheduleId);
      if (response.success) {
        setAlertMessage('일정에서 성공적으로 나갔습니다.');
        setAlertSeverity('success');
        setAlertOpen(true);
        window.location.reload();
      } else {
        setAlertMessage('일정 나가기 중 오류가 발생했습니다.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage('서버 내부 오류가 발생하였습니다.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleDetailClick = (event: React.MouseEvent, scheduleId: number) => {
    if (!activeDeleteMenu) {
      router.push(`/Schedule/${scheduleId}`);
    }
  };

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  /**
   * 일정 목록 렌더링 함수
   */
  const renderSchedules = (
    scheduleListData: ApiResponse<ScheduleList>[] | undefined,
    isSearching: boolean,
  ) => {
    if (!scheduleListData || scheduleListData.length === 0 || !scheduleListData[0]?.data) {
      // ✅ 검색 모드일 경우 NoResultLayout
      if (isSearching) {
        return <NoResultLayout />;
      }

      return (
        <div className={styles.noScheduleContainer}>
          <Image
            src={NoscheduleIcon}
            alt="일정 없음 아이콘"
            width={286}
            height={180}
          />
          <p className={styles.noScheduleMessage}>생성된 일정이 없습니다.</p>
          <p className={styles.noScheduleSubMessage}>
            일정을 만들어 멋진 여행을 준비해보세요!
          </p>
        </div>
      );
    }

    const allSchedules: Schedule[] = scheduleListData.flatMap(
      (page) => page.data?.content || [],
    );

    if (allSchedules.length === 0) {
      if (isSearching) {
        return <NoResultLayout />;
      }

      return (
        <div className={styles.noScheduleContainer}>
          <Image
            src={NoscheduleIcon}
            alt="일정 없음 아이콘"
            width={286}
            height={180}
          />
          <p className={styles.noScheduleMessage}>생성된 일정이 없습니다.</p>
          <p className={styles.noScheduleSubMessage}>
            일정을 만들어 멋진 여행을 준비해보세요!
          </p>
        </div>
      );
    }

    return allSchedules.map((schedule: Schedule) => (
      <div
        key={schedule.scheduleId}
        className={styles.scheduleItem}
        onClick={(e) => handleDetailClick(e, schedule.scheduleId as number)}
      >
        <div className={styles.scheduleHeader}>
          <div className={styles.scheduleName}>{schedule.scheduleName}</div>
          <div className={styles.threeDots}>
            <div
              onClick={(e) =>
                handleToggleDeleteMenu(schedule.scheduleId as number, e)
              }
            >
              <Image src={moreBtn} alt={'moreBtn'} width={26} height={19} />
            </div>
            {activeDeleteMenu === schedule.scheduleId && (
              <div className={styles.deleteMenu}>
                {schedule.role === 'AUTHOR' ? (
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      setSelectedScheduleId(schedule.scheduleId as number);
                      handleDeleteSchedule(e);
                    }}
                  >
                    일정 삭제
                  </button>
                ) : (
                  <button
                    className={styles.leaveButton}
                    onClick={() =>
                      handleLeaveSchedule(schedule.scheduleId as number)
                    }
                  >
                    일정 나가기
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {schedule.thumbnailUrl ? (
          <Image
            src={schedule.thumbnailUrl}
            alt="여행 루트 이미지"
            className={styles.scheduleImage}
            width={414}
            height={174}
          />
        ) : (
          <div className={styles.noImage}>이미지 없음</div>
        )}
        <div className={styles.scheduleContent}>
          <div className={styles.scheduleDatesWrapper}>
            <div className={styles.scheduleDates}>
              일정 : {schedule.startDate} ~ {schedule.endDate}
            </div>
            <div className={styles.scheduleDates}>
              수정일 : {schedule.sinceUpdate}
            </div>
          </div>
          <Image
            src={schedule.author?.profileUrl ?? ''}
            alt="프로필 이미지"
            className={styles.scheduleImageProfile}
            width={38}
            height={38}
          />
        </div>
      </div>
    ));
  };

  if (isAllScheduleLoading || isSharedScheduleLoading) {
    return <DataLoading />;
  }

  if (isLoading) {
    return <DataLoading />;
  }

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  if (isAllScheduleError || isSharedScheduleError) {
    return <div>일정 목록을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className={styles.schedule}>
      <Head>
        <title>최근 일정 - 나만의 여행 계획 보기</title>
        <meta
          name="description"
          content="여행 일정 관리 페이지에서 최근 계획을 확인하고 수정해보세요."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.scheduleTop}>
        <div className={styles.scheduleView}>
          <div className={styles.overlay} />
          <div className={styles.scheduleContent}>
            <div className={styles.scheduleText}>
              <div className={styles.scheduleExplainDiv}>
                모두의 아이디어로 완성되는 여행
              </div>
              <p className={styles.scheduleExplainP}>
                TripTune과 함께 여행 계획을 세우며 새로운 경험을 만들고 소중한
                추억을 쌓아보세요.
              </p>
              <button
                className={styles.createAddButton}
                onClick={handleOpenModal}
              >
                일정 만들기
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.createContainer}>
        <div className={styles.tabAndSearchContainer}>
          <div className={styles.tabContainer}>
            <div
              className={`${styles.scheduleCounter} ${selectedTab === 'all' ? styles.activeTab : ''}`}
              onClick={() => setSelectedTab('all')}
            >
              전체 일정
              <span className={styles.counterNumber}>
                {allScheduleData?.pages[0]?.data?.totalElements ?? 0}
              </span>
            </div>
            <div
              className={`${styles.scheduleCounterShare} ${selectedTab === 'share' ? styles.activeTab : ''}`}
              onClick={() => setSelectedTab('share')}
            >
              공유된 일정
              <span className={styles.counterNumber}>
                {sharedScheduleData
                  ? (sharedScheduleData.pages[0]?.data?.totalSharedElements ?? 0)
                  : (allScheduleData?.pages[0]?.data?.totalSharedElements ?? 0)}
              </span>
            </div>
          </div>

          <div className={styles.travelSearchContainer}>
            <input
              type="text"
              placeholder="일정을 검색하세요."
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <button
              onClick={handleSearchClick}
              title="일정 검색"
            >
              <Image
                src={searchIcon}
                alt="돋보기"
                width={21}
                height={21}
              />
            </button>
          </div>
        </div>
        <div className={styles.scheduleList}>
          {renderSchedules(
            isSearching
              ? searchData?.pages as ApiResponse<ScheduleList>[]
              : selectedTab === 'all'
                ? allScheduleData?.pages as ApiResponse<ScheduleList>[]
                : sharedScheduleData?.pages as ApiResponse<ScheduleList>[],
            isSearching,
          )}
        </div>
        <div
          ref={observerRef}
          className={styles.loadingArea}
          style={{ minHeight: '100px', display: 'flex', justifyContent: 'center', marginTop: '20px' }}
        >
          {isFetchingNextPage ? (
            <DataLoading />
          ) : (
            hasNextPage && <div style={{ padding: '20px', textAlign: 'center' }}>더 많은 일정을 불러오려면 스크롤하세요</div>
          )}
        </div>
        {isDeleteModalOpen && (
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirmation}
          />
        )}
        {isModalOpen && (
          <CalendarLayout mode="create" onClose={() => setIsModalOpen(false)} />
        )}
      </div>
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
