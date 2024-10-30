import React, { useEffect, useState, useRef } from 'react';
import { useScheduleTravelRoute } from '@/hooks/useSchedule';
import DataLoading from '@/components/Common/DataLoading';
import styles from '@/styles/Schedule.module.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import locationIcon from '../../../public/assets/icons/ic_location.png';
import { useParams } from 'next/navigation';

interface Place {
  placeId: number;
  placeName: string;
  thumbnailUrl: string | null;
  country: string;
  city: string;
  district: string;
  address: string;
  detailAddress?: string;
  latitude: number;
  longitude: number;
}

interface PlaceItemProps {
  place: Place;
  index: number;
  movePlace: (dragIndex: number, hoverIndex: number) => void;
}

const PlaceItem = ({ place, index, movePlace }: PlaceItemProps) => {
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

const ScheduleRoute = () => {
  const { scheduleId } = useParams();
  const [places, setPlaces] = useState<Place[]>([]);
  const travelRouteQuery = useScheduleTravelRoute(Number(scheduleId), 1, true);

  const movePlace = (dragIndex: number, hoverIndex: number) => {
    const draggedPlace = places[dragIndex];
    const updatedPlaces = [...places];
    updatedPlaces.splice(dragIndex, 1);
    updatedPlaces.splice(hoverIndex, 0, draggedPlace);
    setPlaces(updatedPlaces);
  };

  useEffect(() => {
    if (travelRouteQuery?.data?.data?.content) {
      const sanitizedPlaces = travelRouteQuery.data.data.content.map(
        (place: Place) => ({
          ...place,
          detailAddress: place.detailAddress ?? '',
        })
      );
      setPlaces(sanitizedPlaces);
    }
  }, [travelRouteQuery?.data?.data]);

  if (travelRouteQuery.isLoading) return <DataLoading />;
  if (travelRouteQuery.error)
    return <p>데이터를 불러오는데 오류가 발생했습니다.</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <ul>
        {places.map((place, index) => (
          <PlaceItem
            key={place.placeId}
            place={place}
            index={index}
            movePlace={movePlace}
          />
        ))}
      </ul>
    </DndProvider>
  );
};

export default ScheduleRoute;
