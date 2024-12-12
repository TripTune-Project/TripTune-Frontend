import React, { useEffect, useRef, useState } from 'react';
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
import trashIconGray from '../../../public/assets/images/일정 만들기/일정 저장 및 수정/trashIconGray.png';
import trashIconRed from '../../../public/assets/images/일정 만들기/일정 저장 및 수정/trashIconRed.png';
import routeVector from '../../../public/assets/images/일정 만들기/일정 저장 및 수정/routeVector.png';

const ScheduleRoute = () => {
  // URL 파라미터에서 scheduleId 가져오기
  const { scheduleId } = useParams();

  // 여행 경로와 장소 데이터를 관리하는 상태 및 액션 가져오기
  const { removePlace, travelRoute, removePlaceFromRoute, onMovePlace } =
    useTravelStore();

  // 무한 스크롤을 위한 Intersection Observer 설정
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useScheduleTravelRoute(Number(scheduleId));

  // API에서 가져온 장소 데이터를 가공하여 fetchedPlaces에 저장
  const fetchedPlaces: Place[] =
    data?.pages?.flatMap((page) =>
      page?.data?.content?.map((route) => ({
        ...route,
        thumbnailUrl: route.thumbnailUrl ?? null,
      }))
    ) ?? [];

  // travelRoute와 API 데이터를 병합하여 실제 사용할 장소 리스트 생성
  const places = travelRoute.map((route) => {
    const matchedPlace = fetchedPlaces.find((p) => p.placeId === route.placeId);
    return matchedPlace ? { ...matchedPlace, ...route } : route;
  });

  // 지도 마커를 관리하는 참조
  const markersRef = useRef<
    { latitude: number; longitude: number; map: any }[]
  >([]);

  // 무한 스크롤 감지 시 다음 페이지 데이터를 가져옴
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 지도 마커를 제거하는 함수
  const removeMarker = (latitude: number, longitude: number) => {
    const markerIndex = markersRef.current.findIndex(
      (marker) => marker.latitude === latitude && marker.longitude === longitude
    );

    if (markerIndex > -1) {
      const [removedMarker] = markersRef.current.splice(markerIndex, 1);
      removedMarker.map = null;
    }
  };

  // 개별 장소 항목 컴포넌트
  const PlaceItem = ({ place, index }: { place: Place; index: number }) => {
    const ref = useRef<HTMLLIElement>(null);

    // 드래그를 설정
    const [{ isDragging }, drag] = useDrag({
      type: 'PLACE',
      item: { place, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    // 드롭을 설정
    const [, drop] = useDrop({
      accept: 'PLACE',
      hover(item: { place: Place; index?: number }) {
        if (!ref.current) return;
        const dragIndex = item.index ?? -1;
        const hoverIndex = index;

        if (dragIndex !== hoverIndex && dragIndex !== -1) {
          onMovePlace(dragIndex, hoverIndex);
          item.index = hoverIndex;
        }
      },
      // 필요 없는 코드라고 생각함
      // drop: (item: { place: Place }) => {
      //   removePlaceFromRoute(item.place.placeId);
      //   removePlace(item.place.placeId);
      //   removeMarker(item.place.latitude, item.place.longitude);
      // },
    });

    // 드래그와 드롭을 참조에 연결
    drag(drop(ref));

    return (
      <li
        ref={ref}
        className={styles.placeItem}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className={styles.placeIndexContainer}>
          <div className={styles.indexCircle}>{index + 1}</div>
        </div>
        {index < places.length - 1 && (
          <Image
            className={styles.routeVector}
            src={routeVector}
            alt={'routeVector'}
            width={0}
            height={66}
          />
        )}
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
          <p className={styles.placeDetailAddress}>
            <Image src={locationIcon} alt='장소' width={15} height={21} />
            &nbsp;{place.address} {place.detailAddress ?? ''}
          </p>
        </div>
      </li>
    );
  };

  // 삭제 드롭존 컴포넌트
  const DeleteDropZone = () => {
    const dropRef = useRef<HTMLDivElement>(null);
    const [isOver, setIsOver] = useState(false);

    // 드롭 영역 설정
    const [, drop] = useDrop({
      accept: 'PLACE',
      collect: (monitor) => ({
        isOverCurrent: monitor.isOver(),
      }),
      hover: () => {
        setIsOver(true);
      },
      drop: (item: { place: Place }) => {
        setIsOver(false);
        removePlaceFromRoute(item.place.placeId);
        removePlace(item.place.placeId);
        removeMarker(item.place.latitude, item.place.longitude);
      },
    });

    // 드롭 참조 연결
    useEffect(() => {
      if (dropRef.current) {
        drop(dropRef.current);
      }
    }, [drop]);

    return (
      <div
        className={`${styles.deleteZone} ${isOver ? styles.trashRed : ''}`}
        ref={dropRef}
      >
        <div className={styles.deleteZoneContent}>
          <Image
            src={isOver ? trashIconRed : trashIconGray}
            alt='trash'
            width={13}
            height={17}
          />
          삭제
        </div>
      </div>
    );
  };

  // 여행 경로가 없는 경우 안내 메시지 표시
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

  // 여행 경로와 삭제 드롭존 렌더링
  return (
    <DndProvider backend={HTML5Backend}>
      <ul style={{ height: '500px', overflowY: 'auto' }}>
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
