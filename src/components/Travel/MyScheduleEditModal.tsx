import React from 'react';
import { useMyScheduleList } from '@/hooks/useSchedule';
import { addPlaceToSchedule } from '@/apis/scheduleApi';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Schedule.module.css';

interface MyScheduleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: number;
}

const MyScheduleEditModal = ({
  isOpen,
  onClose,
  placeId,
}: MyScheduleEditModalProps) => {
  const router = useRouter();
  const {
    data: schedulePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyScheduleList(isOpen);

  if (!isOpen) return null;

  const schedules =
    schedulePages?.pages.flatMap((page) => page.data?.content) || [];

  const handleAddPlace = async (scheduleId: number) => {
    try {
      const response = await addPlaceToSchedule(scheduleId, placeId);
      if (response.success) {
        alert('장소가 성공적으로 추가되었습니다.');
        router.push('/Schedule');
      } else {
        console.error('장소 추가 실패:', response.message);
        alert(response.message);
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      alert('일정을 추가하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <h2>내 일정 목록</h2>
        <div id='scrollableScheduleList' className={styles.messageContainer}>
          <div
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              if (
                scrollHeight - scrollTop === clientHeight &&
                hasNextPage &&
                !isFetchingNextPage
              ) {
                fetchNextPage();
              }
            }}
            className={styles.userMessages}
          >
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <div key={schedule?.scheduleId} className={styles.scheduleItem}>
                  <h3>{schedule?.scheduleName}</h3>
                  <p>{schedule?.startDate}</p>
                  <p>{schedule?.endDate}</p>
                  <p>{schedule?.author}</p>
                  <button
                    className={styles.addButton}
                    onClick={() => handleAddPlace(schedule?.scheduleId)}
                  >
                    추가하기
                  </button>
                </div>
              ))
            ) : (
              <p>등록된 일정이 없습니다.</p>
            )}
            {isFetchingNextPage && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyScheduleEditModal;
