'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useScheduleList, useDeleteSchedule } from '@/hooks/useSchedule';
import styles from '@/styles/Schedule.module.css';
import ScheduleModal from '@/components/Schedule/ScheduleModal';
import DataLoading from '@/components/Common/DataLoading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Place, ApiResponse, ScheduleAllListType } from '@/types/scheduleType';
import triptuneIcon from '../../../public/assets/icons/ic_triptune.png';

export default function Schedule() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDeleteMenu, setActiveDeleteMenu] = useState<number | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useScheduleList(true);

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

  const handleDeleteSchedule = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (selectedScheduleId) {
      deleteScheduleMutate(selectedScheduleId, {
        onSuccess: () => {
          setActiveDeleteMenu(null);
        },
        onError: () => {
          alert('일정 삭제 중 오류가 발생했습니다.');
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString
      .replace('년', '')
      .replace('월', '')
      .replace('일', '')
      .trim()
      .split(' ');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const calculateDaysAgo = (sinceUpdate: string) => {
    const today = new Date();
    const formattedDate = new Date(formatDate(sinceUpdate));
    const timeDiff = today.getTime() - formattedDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff === 0 ? '오늘' : `${daysDiff}일 전`;
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
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

  if (isLoading) {
    return <DataLoading />;
  }

  if (isError) {
    return <div>일정 목록을 불러오는 중 오류가 발생했습니다.</div>;
  }

  const handleDetailClick = (e: React.MouseEvent, scheduleId: number) => {
    if (!activeDeleteMenu) {
      router.push(`/Schedule/${scheduleId}`);
    }
  };

  return (
    <div className={styles.createContainer}>
      <h2 className={styles.detailTitle}>
        <Image src={triptuneIcon} alt={'상세설명'} priority />
        최근 일정
      </h2>
      <button className={styles.allSchedule}>전체 일정</button>
      <button className={styles.allShareSchedule}>공유한 일정</button>
      <button className={styles.createAddButton} onClick={handleOpenModal}>
        {'+'} 일정 생성
      </button>
      <div className={styles.scheduleList}>
        {data?.pages?.map((page) => {
          const typedPage = page as ApiResponse<ScheduleAllListType>;
          return typedPage.data?.content.map((place: Place) => {
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
                  <div className={styles.scheduleName}>
                    {place.scheduleName}
                  </div>
                  <div className={styles.scheduleDates}>
                    {place.sinceUpdate
                      ? calculateDaysAgo(place.sinceUpdate)
                      : '업데이트 정보 없음'}
                  </div>
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
        })}
      </div>
      <div ref={observerRef} className={styles.loadingArea}>
        {isFetchingNextPage ? (
          <p>Loading more...</p>
        ) : (
          <p>더 이상 일정이 없습니다.</p>
        )}
      </div>

      {isModalOpen && <ScheduleModal onClose={handleCloseModal} />}
    </div>
  );
}
