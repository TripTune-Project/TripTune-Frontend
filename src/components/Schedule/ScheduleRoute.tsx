import React, { useEffect, useState, useRef } from 'react';
import { useScheduleTravelRoute } from '@/hooks/useSchedule';
import DataLoading from '@/components/Common/DataLoading';
import styles from '@/styles/Schedule.module.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import locationIcon from '../../../public/assets/icons/ic_location.png';
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
      if (monitor.didDrop() && monitor.getDropResult()?.isDelete) {
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
        <p
          className={styles.placeAddress}
        >{`${place.country} / ${place.city} / ${place.district}`}</p>
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
  
  return (
    <div ref={drop} className={styles.deleteZone}>
      ❌ 삭제 하기 ❌
    </div>
  );
};

interface ScheduleRouteProps {
  places: Place[]; // prop으로 전달되는 초기 장소 리스트
}

const ScheduleRoute = ({ places }: ScheduleRouteProps) => {
  const [routePlaces, setRoutePlaces] = useState<Place[]>([]);
  const { scheduleId } = useParams();
  const travelRouteQuery = useScheduleTravelRoute(Number(scheduleId), 1, true);
  
  // API에서 초기 데이터 불러오기
  useEffect(() => {
    if (travelRouteQuery.isSuccess && travelRouteQuery.data?.data?.content) {
      const apiPlaces = travelRouteQuery.data.data.content.map((place: Place) => ({
        ...place,
        detailAddress: place.detailAddress ?? '',
      }));
      setRoutePlaces(apiPlaces);
    }
  }, [travelRouteQuery.isSuccess, travelRouteQuery.data]);
  
  // prop으로 전달된 places가 변경되면 누적하여 추가
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
      <DeleteDropZone />
    </DndProvider>
  );
};

export default ScheduleRoute;
