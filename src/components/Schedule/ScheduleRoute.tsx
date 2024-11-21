import React, { useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import locationIcon from '../../../public/assets/images/일정 만들기/일정 생성/scheduleDate_mapIcon.png';
import { Place } from '@/types/scheduleType';

interface ScheduleRouteProps {
  places: Place[];
  onMovePlace: (dragIndex: number, hoverIndex: number) => void;
  onDeletePlace: (placeId: number) => void;
}

const ScheduleRoute = ({
  places,
  onMovePlace,
  onDeletePlace,
}: ScheduleRouteProps) => {
  const PlaceItem = ({ place, index }: { place: Place; index: number }) => {
    const ref = useRef<HTMLLIElement>(null);

    const [, drop] = useDrop({
      accept: 'PLACE',
      hover(item: any) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        onMovePlace(dragIndex, hoverIndex);
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
          onDeletePlace(places[item.index].placeId);
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
        {places.map((place, index) => (
          <PlaceItem key={place.placeId} place={place} index={index} />
        ))}
      </ul>
      <DeleteDropZone />
    </DndProvider>
  );
};

export default ScheduleRoute;
