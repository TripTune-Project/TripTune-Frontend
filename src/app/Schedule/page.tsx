'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import styles from '@/styles/Schedule.module.css';
import DataLoading from '@/components/Common/DataLoading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ScheduleList, ApiResponse, Schedule } from '@/types/scheduleType';
import { useDebounce } from '@/hooks/useDebounce';
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
import NoResultLayout from '@/components/Common/NoResult';
import LoginModal from '@/components/Common/LoginModal';
import CalendarLayout from '@/components/Common/CalendarLayout';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

/**
 * SchedulePage 컴포넌트 - 사용자의 일정 목록을 표시하는 페이지
 * 주요 기능:
 * - 내 일정과 공유받은 일정 목록 표시
 * - 무한 스크롤 기능을 통한 일정 목록 페이지네이션
 * - 일정 검색 기능
 * - 일정 삭제 및 공유 일정 나가기 기능
 * - 새로운 일정 만들기
 */
export default function SchedulePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  // 무한 스크롤을 위한 관찰자 요소 참조
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // 모달 및 메뉴 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDeleteMenu, setActiveDeleteMenu] = useState<number | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'share'>('all');

  // 알림 상태 관리
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

  // 검색어 디바운싱 (800ms)
  const debouncedSearchKeyword = useDebounce(searchKeyword, 800);

  // 내 일정 목록 조회 쿼리 (전체 탭 선택 & 검색 중이 아닐 때)
  const {
    data: allScheduleData,
    isLoading: isAllScheduleLoading,
    isError: isAllScheduleError,
    fetchNextPage: fetchNextAllPage,
    hasNextPage: hasNextAllPage,
    isFetchingNextPage: isFetchingNextAllPage,
  } = useScheduleList(selectedTab === 'all' && !isSearching && !!isAuthenticated);

  // 공유받은 일정 목록 조회 쿼리 (공유 탭 선택 & 검색 중이 아닐 때)
  const {
    data: sharedScheduleData,
    isLoading: isSharedScheduleLoading,
    isError: isSharedScheduleError,
    fetchNextPage: fetchNextSharedPage,
    hasNextPage: hasNextSharedPage,
    isFetchingNextPage: isFetchingNextSharedPage,
  } = useSharedScheduleList(selectedTab === 'share' && !isSearching && !!isAuthenticated);

  // 일정 검색 쿼리 (검색 중일 때)
  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = useScheduleListSearch(debouncedSearchKeyword, selectedTab, isSearching && !!isAuthenticated);

  // 현재 상태에 따른 무한 스크롤 페이지네이션 함수 선택
  const fetchNextPage = isSearching
    ? fetchNextSearchPage
    : selectedTab === 'all'
      ? fetchNextAllPage
      : fetchNextSharedPage;

  // 현재 상태에 따른 다음 페이지 존재 여부 확인
  const hasNextPage = isSearching
    ? hasNextSearchPage
    : selectedTab === 'all'
      ? hasNextAllPage
      : hasNextSharedPage;

  // 현재 상태에 따른 페이지 로딩 상태 확인
  const isFetchingNextPage = isSearching
    ? isFetchingNextSearchPage
    : selectedTab === 'all'
      ? isFetchingNextAllPage
      : isFetchingNextSharedPage;

  // 무한 스크롤을 위한 Intersection Observer 설정 및 다음 페이지 로드 로직
  useEffect(() => {
    // IntersectionObserver 콜백 함수 정의
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      // 관찰 대상이 화면에 보이고, 더 로드할 페이지가 있고, 현재 로딩 중이 아닐 때
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
    
    // IntersectionObserver 설정 - 관찰 대상이 20% 보이면 콜백 실행
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport 기준
      rootMargin: '0px',
      threshold: 0.2 // 20% 이상 보이면 콜백 실행
    });
  
    // 현재 관찰 대상 요소
    const currentObserverRef = observerRef.current;
  
    // 관찰 대상이 있으면 관찰 시작
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }
  
    // 컴포넌트 언마운트 시 관찰 중지
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 로그인 상태에 따른 스크롤 제어
  useEffect(() => {
    if (!isAuthenticated) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAuthenticated]);

  // API 에러 처리
  useEffect(() => {
    if (isAllScheduleError || isSharedScheduleError) {
      setAlertMessage('로그인이 필요한 서비스입니다.');
      setAlertSeverity('warning');
      setAlertOpen(true);
    }
  }, [isAllScheduleError, isSharedScheduleError]);

  /**
   * 새 일정 모달 열기 핸들러
   */
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  /**
   * 일정 옵션 메뉴 토글 핸들러
   * @param scheduleId 선택한 일정 ID
   * @param event 마우스 이벤트
   */
  const handleToggleDeleteMenu = (
    scheduleId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setActiveDeleteMenu((prevId) =>
      prevId === scheduleId ? null : scheduleId
    );
  };

  /**
   * 일정 삭제 확인 핸들러
   * 삭제 모달에서 확인 버튼 클릭 시 실행
   */
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

  /**
   * 일정 삭제 버튼 클릭 핸들러
   * 삭제 확인 모달을 표시
   */
  const handleDeleteSchedule = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  /**
   * 공유받은 일정 나가기 핸들러
   * @param scheduleId 나갈 일정 ID
   */
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

  /**
   * 일정 상세 페이지로 이동하는 핸들러
   * 옵션 메뉴가 열려 있지 않을 때만 동작
   * @param event 마우스 이벤트
   * @param scheduleId 이동할 일정 ID
   */
  const handleDetailClick = (event: React.MouseEvent, scheduleId: number) => {
    if (!activeDeleteMenu) {
      router.push(`/Schedule/${scheduleId}`);
    }
  };

  /**
   * 알림창 닫기 핸들러
   * @param event 이벤트 객체
   * @param reason 닫히는 이유
   */
  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  /**
   * 일정 목록 렌더링 함수
   * 데이터 상태에 따라 일정 목록 또는 빈 상태 화면을 렌더링
   *
   * @param scheduleListData 일정 목록 데이터
   * @param isSearching 검색 모드 여부
   * @returns 렌더링할 JSX 요소
   */
  const renderSchedules = (
    scheduleListData: ApiResponse<ScheduleList>[] | undefined,
    isSearching: boolean
  ) => {
    // 데이터가 없거나 모든 페이지에 데이터가 없는 경우
    if (!scheduleListData || scheduleListData.length === 0 || !scheduleListData[0]?.data) {
      // 검색 결과가 없는 경우
      if (isSearching) {
        return <NoResultLayout />;
      }
  
      // 일정이 없는 경우
      setAlertMessage('일정 정보를 찾을 수 없습니다.');
      setAlertSeverity('error');
      setAlertOpen(true);
      setTimeout(() => {
        router.back();
      }, 3000);
      
      return (
        <div className={styles.noScheduleContainer}>
          <Image
            src={NoscheduleIcon}
            alt='일정 없음 아이콘'
            width={286}
            height={180}
          />
          <p className={styles.noScheduleMessage}>일정 정보를 찾을 수 없습니다.</p>
        </div>
      );
    }
  
    // 모든 페이지의 일정을 하나의 배열로 합침
    const allSchedules: Schedule[] = scheduleListData.flatMap(
      (page) => page.data?.content || []
    );
  
    // 일정이 없는 경우
    if (allSchedules.length === 0) {
      if (isSearching) {
        return <NoResultLayout />;
      }
      
      return (
        <div className={styles.noScheduleContainer}>
          <Image
            src={NoscheduleIcon}
            alt='일정 없음 아이콘'
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
  
    // 일정 목록 렌더링
    return allSchedules.map((schedule: Schedule) => (
      <div
        key={schedule.scheduleId}
        className={styles.scheduleItem}
        onClick={(e) => handleDetailClick(e, schedule.scheduleId as number)}
      >
        <div>
          {/* 옵션 메뉴 */}
          <div className={styles.hoverMenu}>
            <div
              className={styles.threeDots}
              onClick={(e) =>
                handleToggleDeleteMenu(schedule.scheduleId as number, e)
              }
            >
              <Image src={moreBtn} alt={'moreBtn'} width={14} height={2} />
            </div>
            {activeDeleteMenu === schedule.scheduleId && (
              <div className={styles.deleteMenu}>
                {/* 일정 작성자인 경우 삭제 버튼 표시 */}
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
                  /* 작성자가 아닌 경우 나가기 버튼 표시 */
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
          <div className={styles.scheduleName}>{schedule.scheduleName}</div>
        </div>
        {/* 일정 썸네일 이미지 */}
        {schedule.thumbnailUrl ? (
          <Image
            src={schedule.thumbnailUrl}
            alt='여행 루트 이미지'
            className={styles.scheduleImage}
            width={414}
            height={174}
          />
        ) : (
          <div className={styles.noImage}>이미지 없음</div>
        )}
        {/* 일정 정보 영역 */}
        <div className={styles.scheduleContent}>
          <div className={styles.scheduleDates}>
            일정 : {schedule.startDate} ~ {schedule.endDate}
          </div>
          <div className={styles.scheduleDates}>
            수정일 : {schedule.sinceUpdate}
          </div>
          <Image
            src={schedule.author?.profileUrl ?? ''}
            alt='프로필 이미지'
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
          name='description'
          content='여행 일정 관리 페이지에서 최근 계획을 확인하고 수정해보세요. 여행 계획을 관리하고 원하는 일정을 검색할 수 있습니다.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <div className={styles.scheduleTop}>
        <div className={styles.scheduleView}>
          <Image
            className={styles.scheduleImg}
            src={ScheduleImage}
            alt='일정 목록 이미지'
            priority
          />
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
        <button
          className={`${styles.scheduleCounter} ${selectedTab === 'all' ? styles.activeTab : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          전체 일정
          <span className={styles.counterNumber}>
            {allScheduleData?.pages[0]?.data?.totalElements ?? 0}
          </span>
        </button>

        <button
          className={`${styles.scheduleCounterShare} ${selectedTab === 'share' ? styles.activeTab : ''}`}
          onClick={() => setSelectedTab('share')}
        >
          공유된 일정
          <span className={styles.counterNumber}>
            {sharedScheduleData
              ? (sharedScheduleData.pages[0]?.data?.totalSharedElements ?? 0)
              : (allScheduleData?.pages[0]?.data?.totalSharedElements ?? 0)}
          </span>
        </button>

        <div className={styles.travelSearchContainer}>
          <input
            type='text'
            placeholder='일정을 검색하세요.'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button 
            onClick={() => setIsSearching(!!debouncedSearchKeyword)}
            title="일정 검색"
          >
            <Image
              style={{ marginLeft: '-5px' }}
              src={searchIcon}
              alt='돋보기'
              width={21}
              height={21}
            />
          </button>
        </div>
        <div className={styles.scheduleList}>
          {renderSchedules(
            isSearching
              ? searchData?.pages as ApiResponse<ScheduleList>[]
              : selectedTab === 'all'
                ? allScheduleData?.pages as ApiResponse<ScheduleList>[]
                : sharedScheduleData?.pages as ApiResponse<ScheduleList>[],
            isSearching
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
          <CalendarLayout mode='create' onClose={() => setIsModalOpen(false)} />
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
