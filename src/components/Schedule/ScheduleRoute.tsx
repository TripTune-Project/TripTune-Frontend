import React, { useRef, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useInView } from 'react-intersection-observer';
import { useScheduleTravelRoute } from '@/hooks/useSchedule';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import locationIcon from '../../../public/assets/images/일정 만들기/일정 생성/scheduleDate_mapIcon.png';
import { useTravelStore } from '@/store/scheduleStore';
import { useParams } from 'next/navigation';
import { Place } from '@/types/scheduleType';

const ScheduleRoute = () => {
  const { scheduleId } = useParams();
  const { ref, inView } = useInView();
  const { addedPlaces, removePlace, movePlace } = useTravelStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useScheduleTravelRoute(Number(scheduleId));

  const fetchedPlaces: Place[] =
    data?.pages.flatMap((page) =>
      page.data.content.map((route) => ({
        ...route,
        thumbnailUrl: route.thumbnailUrl ?? null,
      }))
    ) ?? [];
  const places = [
    ...fetchedPlaces.map((place) => place.placeId),
    ...Array.from(addedPlaces).map((placeId) => +placeId),
  ];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const PlaceItem = ({
    placeId,
    index,
  }: {
    placeId: number;
    index: number;
  }) => {
    const ref = useRef<HTMLLIElement>(null);

    const [, drop] = useDrop({
      accept: 'PLACE',
      hover(item: { index: number }) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        movePlace(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: 'PLACE',
      item: { index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<{ isDelete: boolean }>();
        if (monitor.didDrop() && dropResult?.isDelete) {
          const placeId = places[item.index];
          removePlace(placeId);
        }
      },
    });

    drag(drop(ref));

    const place = fetchedPlaces.find((p) => p.placeId === placeId);
    if (!place) return null;

    return (
      <li
        ref={ref}
        className={styles.placeItem}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className={styles.placeThumbnail}>
          {place.thumbnailUrl ? (
            <Image
              src={place.thumbnailUrl}
              alt={place.placeName}
              width={150}
              height={150}
              className={styles.thumbnailImage}
              priority
            />
          ) : (
            <div className={styles.noImage}>이미지 없음</div>
          )}
        </div>
        <div className={styles.placeInfo}>
          <div className={styles.placeName}>{place.placeName}</div>
          <p className={styles.placeAddress}>
            {`${place.country} / ${place.city} / ${place.district}`}
          </p>
          <p className={styles.placeDetailAddress}>
            <Image src={locationIcon} alt='장소' width={15} height={21} />
            &nbsp;{place.address} {place.detailAddress ?? ''}
          </p>
        </div>
      </li>
    );
  };

  const DeleteDropZone = () => {
    const [, drop] = useDrop({
      accept: 'PLACE',
      drop: () => ({ isDelete: true }),
    });

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) drop(node);
      },
      [drop]
    );

    return (
      <div ref={setRef} className={styles.deleteZone}>
        휴지통 ❌
      </div>
    );
  };

  if (!places || places.length === 0) {
    return <p className={styles.noPlaces}>등록된 장소가 없습니다.</p>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ul>
        {places.map((placeId, index) => (
          <PlaceItem key={placeId} placeId={placeId} index={index} />
        ))}
        {hasNextPage && (
          <li ref={ref} className={styles.loading}>
            {isFetchingNextPage ? '로딩 중...' : '더 불러오기...'}
          </li>
        )}
      </ul>
      <DeleteDropZone />
    </DndProvider>
  );
};

export default ScheduleRoute;
