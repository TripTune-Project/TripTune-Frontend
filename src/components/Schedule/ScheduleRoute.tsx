import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useScheduleTravelRoute } from '@/hooks/useSchedule';
import DataLoading from '@/components/Common/DataLoading';
import styles from '@/styles/Schedule.module.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import locationIcon from '../../../public/assets/images/일정 만들기/일정 생성/scheduleDate_mapIcon.png';
import { useParams } from 'next/navigation';
import { Place } from '@/types/scheduleType';

interface PlaceItemProps {
  place: Place;
  index: number;
  movePlace: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (index: number) => void;
}

const PlaceItem = ({ place, index, movePlace, onDelete }: PlaceItemProps) => {
  const ref = useRef<HTMLLIElement>(null);
  
  const [, drop] = useDrop({
    accept: 'PLACE',
    hover(item: any) {
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
      const dropResult = monitor.getDropResult() as any;
      if (monitor.didDrop() && dropResult?.isDelete) {
        onDelete(item.index);
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
      ❌ 삭제 하기 ❌
    </div>
  );
};

interface ScheduleRouteProps {
  places: Place[];
}

const ScheduleRoute = ({ places }: ScheduleRouteProps) => {
  const [routePlaces, setRoutePlaces] = useState<Place[]>([]);
  const { scheduleId } = useParams();
  const travelRouteQuery = useScheduleTravelRoute(Number(scheduleId), 1, true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (travelRouteQuery.isSuccess && travelRouteQuery.data?.pages) {
      const apiPlaces = travelRouteQuery.data.pages.flatMap((page:any) =>
        page.data.content.map((place: Place) => ({
          ...place,
          detailAddress: place.detailAddress ?? '',
        }))
      );
      setRoutePlaces(apiPlaces);
    }
  }, [travelRouteQuery.isSuccess, travelRouteQuery.data]);
  
  useEffect(() => {
    if (places) {
      setRoutePlaces((prevPlaces) => [
        ...prevPlaces,
        ...places.filter(
          (place) => !prevPlaces.some((p) => p.placeId === place.placeId)
        ),
      ]);
    }
  }, [places]);
  
  const movePlace = (dragIndex: number, hoverIndex: number) => {
    const draggedPlace = routePlaces[dragIndex];
    const updatedPlaces = [...routePlaces];
    updatedPlaces.splice(dragIndex, 1);
    updatedPlaces.splice(hoverIndex, 0, draggedPlace);
    setRoutePlaces(updatedPlaces);
  };
  
  const handleDelete = (index: number) => {
    setRoutePlaces((prevPlaces) => prevPlaces.filter((_, i) => i !== index));
  };
  
  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && travelRouteQuery.hasNextPage) {
      travelRouteQuery.fetchNextPage();
    }
  };
  
  useEffect(() => {
    const observerNode = observerRef.current;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });
    if (observerNode) observer.observe(observerNode);
    return () => {
      if (observerNode) observer.unobserve(observerNode);
    };
  }, [travelRouteQuery.hasNextPage]);
  
  if (travelRouteQuery.isLoading) return <DataLoading />;
  if (travelRouteQuery.error)
    return <p>데이터를 불러오는데 오류가 발생했습니다.</p>;
  
  return (
    <DndProvider backend={HTML5Backend}>
      <ul className={styles.routeList}>
        {routePlaces.map((place, index) => (
          <PlaceItem
            key={place.placeId}
            place={place}
            index={index}
            movePlace={movePlace}
            onDelete={handleDelete}
          />
        ))}
      </ul>
      <div ref={observerRef} className={styles.loadingArea}>
        {travelRouteQuery.isFetchingNextPage ? (
          <DataLoading />
        ) : !travelRouteQuery.hasNextPage ? (
          <p>더 이상 장소가 없습니다.</p>
        ) : null}
      </div>
      <DeleteDropZone />
    </DndProvider>
  );
};

export default ScheduleRoute;
