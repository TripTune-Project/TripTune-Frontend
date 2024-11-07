'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import {
  useScheduleList,
  useDeleteSchedule,
  useScheduleListSearch,
  useUpdateScheduleAttendees,
} from '@/hooks/useSchedule';
import styles from '@/styles/Schedule.module.css';
import ScheduleModal from '@/components/Schedule/ScheduleModal';
import DataLoading from '@/components/Common/DataLoading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Place, ApiResponse, ScheduleAllListType } from '@/types/scheduleType';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';
import { useDebounce } from '@/hooks/useDebounce';
import ScheduleImage from '../../../public/assets/images/일정 만들기/일정 목록 조회/computer.jpg';
import NoscheduleIcon from '../../../public/assets/images/일정 만들기/일정 목록 조회/scheduleIcon.png';
import searchIcon from '../../../public/assets/images/일정 만들기/일정 목록 조회/searchIcon.png';
import useAuth from '@/hooks/useAuth';

export default function Schedule() {
  const router = useRouter();
  const { checkAuthStatus } = useAuth();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDeleteMenu, setActiveDeleteMenu] = useState<number | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearchKeyword = useDebounce(searchKeyword, 800);
  
  const {
    data: scheduleData,
    isLoading: isScheduleLoading,
    isError: isScheduleError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useScheduleList(!isSearching);
  
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = useScheduleListSearch(debouncedSearchKeyword, isSearching);
  
  const observerRef = useRef<HTMLDivElement | null>(null);
  
  const { mutate: deleteScheduleMutate } = useDeleteSchedule();
  const { mutate: leaveScheduleMutate } = useUpdateScheduleAttendees();
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleToggleDeleteMenu = (scheduleId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveDeleteMenu((prevId) => (prevId === scheduleId ? null : scheduleId));
  };
  
  const handleDeleteConfirmation = () => {
    if (selectedScheduleId) {
      deleteScheduleMutate(selectedScheduleId, {
        onSuccess: () => {
          setActiveDeleteMenu(null);
          setIsDeleteModalOpen(false);
        },
        onError: () => {
          alert('일정 삭제 중 오류가 발생했습니다.');
        },
      });
    }
  };
  
  const handleDeleteSchedule = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDeleteModalOpen(true);
  };
  
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && (hasNextPage || hasNextSearchPage)) {
        if (isSearching) {
          fetchNextSearchPage();
        } else {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, fetchNextSearchPage, hasNextPage, hasNextSearchPage, isSearching]
  );
  
  useEffect(() => {
    const observerNode = observerRef.current;
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerNode) observer.observe(observerNode);
    
    return () => {
      if (observerNode) observer.unobserve(observerNode);
    };
  }, [handleObserver]);
  
  useEffect(() => {
    setIsSearching(!!debouncedSearchKeyword);
  }, [debouncedSearchKeyword]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };
  
  if (isScheduleLoading || isSearchLoading) {
    return <DataLoading />;
  }
  
  if (isScheduleError || isSearchError) {
    return <div>일정 목록을 불러오는 중 오류가 발생했습니다.</div>;
  }
  
  const handleDetailClick = (e: React.MouseEvent, scheduleId: number) => {
    if (!activeDeleteMenu) {
      router.push(`/Schedule/${scheduleId}`);
    }
  };
  
  const renderSchedules = (scheduleListData: ApiResponse<ScheduleAllListType> | undefined) => {
    if (!scheduleListData?.data || scheduleListData.data.content.length === 0) {
      return (
        <div className={styles.noScheduleContainer}>
          <Image
            src={NoscheduleIcon}
            alt="일정 없음 아이콘"
            className={styles.noScheduleIcon}
            width={80}
            height={80}
          />
          <p className={styles.noScheduleMessage}>생성된 일정이 없습니다.</p>
          <p className={styles.noScheduleSubMessage}>
            일정을 만들어 멋진 여행을 준비해보세요!
          </p>
        </div>
      );
    }
    
    return scheduleListData.data.content.map((place: Place) => {
      return (
        <div
          key={place.scheduleId}
          className={styles.scheduleItem}
          onClick={(e) => {
            if (place.scheduleId !== undefined) {
              handleDetailClick(e, place.scheduleId);
            }
          }}
        >
          <div>
            <div className={styles.hoverMenu}>
              <div
                className={styles.threeDots}
                onClick={(e) => {
                  if (place.scheduleId !== undefined) {
                    handleToggleDeleteMenu(place.scheduleId, e);
                  }
                }}
              >
                ...
              </div>
              {activeDeleteMenu === place.scheduleId && (
                <div className={styles.deleteMenu}>
                  {place.role === 'AUTHOR' ? (
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        if (place.scheduleId !== undefined) {
                          setSelectedScheduleId(place.scheduleId);
                          handleDeleteSchedule(e);
                        }
                      }}
                    >
                      일정 삭제
                    </button>
                  ) : (
                    <button
                      className={styles.leaveButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (place.scheduleId !== undefined) {
                          handleLeaveSchedule(place.scheduleId);
                        }
                      }}
                    >
                      일정 나가기
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className={styles.scheduleName}>{place.scheduleName}</div>
          </div>
          {place.thumbnailUrl ? (
            <Image
              src={place.thumbnailUrl}
              alt="여행 루트 이미지"
              className={styles.scheduleImage}
              width={256}
              height={158}
            />
          ) : (
            <div className={styles.noImage}>이미지 없음</div>
          )}
          <div className={styles.scheduleContent}>
            <div className={styles.scheduleDates}>
              일정 : {place.startDate} ~ {place.endDate}
            </div>
            <div className={styles.scheduleDates}>
              수정일 : {place.sinceUpdate}
            </div>
            <Image
              src={place.author?.profileUrl ?? ''}
              alt="프로필 이미지"
              className={styles.scheduleImageProfile}
              width={26}
              height={26}
            />
          </div>
        </div>
      );
    });
  };
  
  const handleLeaveSchedule = (scheduleId: number) => {
    if (!scheduleId) return;
    
    leaveScheduleMutate(
      { scheduleId, attendeeList: [] },
      {
        onSuccess: () => {
          alert('일정에서 나갔습니다.');
          setActiveDeleteMenu(null);
        },
        onError: () => {
          alert('일정 나가기 중 오류가 발생했습니다.');
        },
      }
    );
  };
  
  return (
    <div className={styles.schedule}>
      <Head>
        <title>최근 일정 - 나만의 여행 계획 보기</title>
        <meta
          name="description"
          content="여행 일정 관리 페이지에서 최근 계획을 확인하고 수정해보세요. 여행 계획을 관리하고 원하는 일정을 검색할 수 있습니다."
        />
        <meta
          name="keywords"
          content="여행 일정, 여행 계획, 일정 관리, 최근 여행, 여행 검색"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <meta property="og:title" content="최근 일정 - 나만의 여행 계획 보기" />
        <meta
          property="og:description"
          content="최근 일정에서 원하는 여행 계획을 쉽게 관리하고 검색할 수 있습니다."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://triptune.netlify.app/Schedule"
        />
        
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={styles.scheduleTop}>
        <div className={styles.scheduleView}>
          <Image
            className={styles.scheduleImg}
            src={ScheduleImage}
            alt="일정 목록 이미지"
            priority
          />
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
        <div className={styles.scheduleCounter}>
          전체 일정 <span className={styles.counterNumber}>0</span>
        </div>
        <div className={styles.scheduleCounterShare}>
          공유된 일정 <span className={styles.counterNumber}>0</span>
        </div>
        <div className={styles.travelSearchContainer}>
          <input
            type="text"
            placeholder="원하는 여행지를 검색하세요"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
          <button onClick={() => setIsSearching(!!debouncedSearchKeyword)}>
            <Image src={searchIcon} alt="돋보기" width={21} height={21} />
          </button>
        </div>
        <div className={styles.scheduleList}>
          {!isSearching
            ? scheduleData?.pages?.map((page) =>
              renderSchedules(page as ApiResponse<ScheduleAllListType>)
            )
            : searchData?.pages?.map((page) =>
              renderSchedules(page as ApiResponse<ScheduleAllListType>)
            )}
        </div>
        <div ref={observerRef} className={styles.loadingArea}>
          {isFetchingNextPage || isFetchingNextSearchPage ? (
            <p>로딩 중...</p>
          ) : (
            <p>더 이상 일정이 없습니다.</p>
          )}
        </div>
        {isDeleteModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.deleteModal}>
              <p>{MODAL_MESSAGES.confirmDeleteSchedule.title}</p>
              <button onClick={handleDeleteConfirmation}>
                {MODAL_MESSAGES.confirmDeleteSchedule.confirmButton}
              </button>
              <button onClick={() => setIsDeleteModalOpen(false)}>
                {MODAL_MESSAGES.confirmDeleteSchedule.cancelButton}
              </button>
            </div>
          </div>
        )}
        {isModalOpen && <ScheduleModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
}
