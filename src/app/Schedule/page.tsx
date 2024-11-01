'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import {
  useScheduleList,
  useDeleteSchedule,
  useScheduleListSearch,
} from '@/hooks/useSchedule';
import styles from '@/styles/Schedule.module.css';
import ScheduleModal from '@/components/Schedule/ScheduleModal';
import DataLoading from '@/components/Common/DataLoading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Place, ApiResponse, ScheduleAllListType } from '@/types/scheduleType';
import triptuneIcon from '../../../public/assets/images/로고/triptuneIcon-removebg.png';
import { MODAL_MESSAGES } from '@/components/Common/ConfirmationModalMessage';
import { useDebounce } from '@/hooks/useDebounce';

export default function Schedule() {
  const router = useRouter();
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
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleToggleDeleteMenu = (
    scheduleId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setActiveDeleteMenu((prevId) =>
      prevId === scheduleId ? null : scheduleId
    );
  };
  
  const { mutate: deleteScheduleMutate } = useDeleteSchedule();
  
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
    [
      fetchNextPage,
      fetchNextSearchPage,
      hasNextPage,
      hasNextSearchPage,
      isSearching,
    ]
  );
  
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);
    
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
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
  
  const renderSchedules = (
    scheduleListData: ApiResponse<ScheduleAllListType> | undefined
  ) => {
    return scheduleListData?.data?.content.map((place: Place) => {
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
          {place.thumbnailUrl ? (
            <Image
              src={place.thumbnailUrl}
              alt='여행 루트 이미지'
              className={styles.scheduleImage}
              width={256}
              height={158}
            />
          ) : (
            <div className={styles.noImage}>이미지 없음</div>
          )}
          <div className={styles.scheduleContent}>
            <div className={styles.scheduleName}>{place.scheduleName}</div>
            <div className={styles.scheduleDates}>{place.sinceUpdate}</div>
          </div>
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
              </div>
            )}
          </div>
        </div>
      );
    });
  };
  
  return (
    <>
      <Head>
        <title>최근 일정 - 나만의 여행 계획 보기</title>
        <meta name="description" content="여행 일정 관리 페이지에서 최근 계획을 확인하고 수정해보세요. 여행 계획을 관리하고 원하는 일정을 검색할 수 있습니다." />
        <meta name="keywords" content="여행 일정, 여행 계획, 일정 관리, 최근 여행, 여행 검색" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <meta property="og:title" content="최근 일정 - 나만의 여행 계획 보기" />
        <meta property="og:description" content="최근 일정에서 원하는 여행 계획을 쉽게 관리하고 검색할 수 있습니다." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://triptune.netlify.app/Schedule" />
        
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className={styles.createContainer}>
        <h2 className={styles.detailTitle}>
          <Image src={triptuneIcon} alt={'상세설명'} priority />
          최근 일정
        </h2>
        <div className={styles.travelSearchContainer}>
          <input
            type='text'
            placeholder='원하는 일정을 검색하세요'
            value={searchKeyword}
            onChange={handleSearchChange}
          />
          <button onClick={() => setIsSearching(!!debouncedSearchKeyword)}>
            돋보기
          </button>
        </div>
        <button className={styles.allSchedule}>전체 일정</button>
        <button className={styles.allShareSchedule}>공유한 일정</button>
        <button className={styles.createAddButton} onClick={handleOpenModal}>
          {'+'} 일정 생성
        </button>
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
            <p>Loading more...</p>
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
    </>
  );
}
