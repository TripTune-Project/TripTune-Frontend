import React, { useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useInView } from 'react-intersection-observer';
import { useScheduleTravelRoute } from '@/hooks/useSchedule';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import locationIcon from '../../../public/assets/images/일정 만들기/일정 저장 및 수정/mapIcon.png';
import { useTravelStore } from '@/store/scheduleStore';
import { useParams } from 'next/navigation';
import { Place } from '@/types/scheduleType';
import travelRootEmptyIcon from '../../../public/assets/images/일정 만들기/일정 저장 및 수정/travelRootEmptyIcon.png';

const ScheduleRoute = () => {
  const { scheduleId } = useParams();
  const { removePlace, travelRoute, removePlaceFromRoute, onMovePlace } =
    useTravelStore();

  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useScheduleTravelRoute(Number(scheduleId));

  const fetchedPlaces: Place[] =
    data?.pages?.flatMap((page) =>
      page?.data?.content?.map((route) => ({
        ...route,
        thumbnailUrl: route.thumbnailUrl ?? null,
      }))
    ) ?? [];

  const places = travelRoute.map((route) => {
    const matchedPlace = fetchedPlaces.find((p) => p.placeId === route.placeId);
    return matchedPlace ? { ...matchedPlace, ...route } : route;
  });

  const markersRef = useRef<
    { latitude: number; longitude: number; map: any }[]
  >([]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const removeMarker = (latitude: number, longitude: number) => {
    const markerIndex = markersRef.current.findIndex(
      (marker) => marker.latitude === latitude && marker.longitude === longitude
    );

    if (markerIndex > -1) {
      const [removedMarker] = markersRef.current.splice(markerIndex, 1);
      removedMarker.map = null;
    }
  };

  const PlaceItem = ({ place, index }: { place: Place; index: number }) => {
    const ref = useRef<HTMLLIElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: 'PLACE',
      item: { place, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'PLACE',
      hover(item: { index: number }) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex !== hoverIndex) {
          onMovePlace(dragIndex, hoverIndex);
          item.index = hoverIndex;
        }
      },
    });

    drag(drop(ref));

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
    const dropRef = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
      accept: 'PLACE',
      drop: (item: { place: Place }) => {
        removePlaceFromRoute(item.place.placeId);
        removePlace(item.place.placeId);
        removeMarker(item.place.latitude, item.place.longitude);
      },
    });

    useEffect(() => {
      if (dropRef.current) {
        drop(dropRef.current);
      }
    }, [drop]);

    return (
      <div className={styles.deleteZone}>
        <div ref={dropRef} className={styles.deleteZoneContent}>
          휴지통 ❌
        </div>
      </div>
    );
  };

  if (!places || places.length === 0) {
    return (
      <p className={styles.noResults}>
        <Image
          src={travelRootEmptyIcon}
          alt={'no-schedule-root'}
          width={293}
          height={158}
          style={{ marginLeft: '130px' }}
        />
        <div className={styles.noText}>여행 루트가 비어 있습니다.</div>
        <br />
        <p>여행지 검색을 통해 여행 루트에 장소를 추가해주세요.</p>
      </p>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ul style={{ height: '430px', overflowY: 'auto' }}>
        {places.map((place, index) => (
          <PlaceItem key={place.placeId} place={place} index={index} />
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
