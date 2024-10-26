'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useScheduleList } from '@/hooks/useSchedule';
import styles from '@/styles/Schedule.module.css';
import ScheduleModal from '@/components/Schedule/ScheduleModal';
import DataLoading from '@/components/Common/DataLoading';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Place, ApiResponse, ScheduleAllListType } from '@/types/scheduleType';

const transformToSchedule = (places: Place[]) => {
  return places.map((place) => ({
    id: place.placeId,
    name: place.placeName,
    startDate: place.startDate || '',
    endDate: place.endDate || '',
    sinceUpdate: place.sinceUpdate || '',
    thumbnailUrl: place.thumbnailUrl,
  }));
};

export default function Schedule() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleDetailClick = (scheduleId: number) => {
    router.push(`/Schedule/${scheduleId}`);
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.scheduleTitle}>일정 리스트 최근 리스트</h1>
      <button className={styles.createAddButton} onClick={handleOpenModal}>
        새 일정 리스트 추가
      </button>
      <div className={styles.scheduleList}>
        {/* data.pages를 명시적으로 ScheduleAllListType으로 처리 */}
        {data?.pages?.map((page, index) => {
          const typedPage = page as ApiResponse<ScheduleAllListType>;
          return typedPage.data?.content.map((place: Place) => {
            const schedule = transformToSchedule([place])[0];
            return (
              <div
                key={schedule.id}
                className={styles.scheduleItem}
                onClick={() => handleDetailClick(schedule.id)}
              >
                {schedule.thumbnailUrl ? (
                  <Image
                    src={schedule.thumbnailUrl}
                    alt='여행 루트 이미지'
                    className={styles.scheduleImage}
                    width={300}
                    height={300}
                  />
                ) : (
                  <div
                    className={styles.noImage}
                    style={{ width: '300px', height: '300px' }}
                  >
                    이미지 없음
                  </div>
                )}
                <div className={styles.scheduleContent}>
                  <div className={styles.scheduleName}>
                    여행 이름: {schedule.name}
                  </div>
                  <div className={styles.scheduleDates}>
                    여행 일정: {schedule.startDate} ~ {schedule.endDate}
                  </div>
                  <div className={styles.scheduleDates}>
                    업데이트:{' '}
                    {schedule.sinceUpdate
                      ? calculateDaysAgo(schedule.sinceUpdate)
                      : '업데이트 정보 없음'}
                  </div>
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
