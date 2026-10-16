import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useInView } from 'react-intersection-observer';
import { useTravelStore } from '@/store/scheduleStore';
import { useParams } from 'next/navigation';
import { Place } from '@/types/scheduleType';
import styles from '@/styles/Schedule.module.css';
import Image from 'next/image';
import locationIcon from '../../../../public/assets/images/일정 만들기/일정 저장 및 수정/mapIcon.png';
import travelRootEmptyIcon from '../../../../public/assets/images/일정 만들기/일정 저장 및 수정/travelRootEmptyIcon.png';
import trashIconGray from '../../../../public/assets/images/일정 만들기/일정 저장 및 수정/trashIconGray.png';
import trashIconRed from '../../../../public/assets/images/일정 만들기/일정 저장 및 수정/trashIconRed.png';
import routeVector from '../../../../public/assets/images/일정 만들기/일정 저장 및 수정/routeVector.png';

// 여행 루트 API 한 페이지 크기
const ROUTE_PAGE_SIZE = 5;

const ScheduleRoute = () => {
  // URL 파라미터에서 scheduleId 가져오기
  // useParams의 반환 타입을 업데이트
  const params = useParams();
  const scheduleId = params?.scheduleId as string;

  // Zustand store에서 액션 및 상태 가져오기
  const { travelRoute, removeRouteAt, onMovePlace, fetchAndMergeRoutes } =
    useTravelStore();

  // 무한 스크롤: 저장 시 루트 전체를 보내야 하므로 데이터는 모두 받아 두고,
  // 화면에는 API 페이지 크기(5개)씩 늘려가며 보여준다
  const { ref, inView } = useInView();
  const [visibleCount, setVisibleCount] = useState(ROUTE_PAGE_SIZE);

  // 페이지 로드 시 과거 데이터와 병합
  useEffect(() => {
    if (scheduleId) fetchAndMergeRoutes(Number(scheduleId));
  }, [scheduleId, fetchAndMergeRoutes]);

  // 목록 바닥(inView)에 닿으면 다음 5개를 보여준다
  // visibleCount를 deps에 넣어, 늘린 뒤에도 바닥이 보이면 계속 이어서 늘린다
  useEffect(() => {
    if (inView && visibleCount < travelRoute.length) {
      setVisibleCount((count) => count + ROUTE_PAGE_SIZE);
    }
  }, [inView, visibleCount, travelRoute.length]);

  // 지도 마커를 관리하는 참조
  const markersRef = useRef<
    { latitude: number; longitude: number; map: unknown }[]
  >([]);

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
        {index < travelRoute.length - 1 && (
          <Image
            className={styles.routeVector}
            src={routeVector}
            alt={'routeVector'}
            width={0}
            height={66}
          />
        )}
        <div className={styles.placeThumbnail} style={{ width: '60px', height: '60px', minWidth: '60px' }}>
          {place.thumbnailUrl ? (
            <Image
              src={place.thumbnailUrl}
              alt={place.placeName}
              width={60}
              height={60}
              className={styles.thumbnailImage}
              priority
            />
          ) : (
            <div className={styles.noImage} style={{ width: '60px', height: '60px', fontSize: '8px' }}>이미지 없음</div>
          )}
        </div>
        <div className={styles.placeInfo}>
          <div className={styles.placeName}>{place.placeName}</div>
          <p className={styles.placeDetailAddress}>
            <Image src={locationIcon} alt='장소' width={8} height={12} />
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
      hover: () => {
        setIsOver(true);
      },
      drop: (item: { place: Place; index: number }) => {
        setIsOver(false);
        // 같은 장소가 두 번 있을 수 있으므로 끌어온 순서의 항목 하나만 지운다
        removeRouteAt(item.index);
        removeMarker(item.place.latitude, item.place.longitude);
      },
      canDrop: () => true,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
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
  if (!travelRoute || travelRoute.length === 0) {
    return (
      <p className={styles.noResults}>
        <Image
          src={travelRootEmptyIcon}
          alt={'no-schedule-root'}
          width={293}
          height={158}
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
      {/* 좌측 패널(=지도/대화창과 같은 825px) 안에서 입력·탭 아래 남는 공간을 모두 채움
          → 목록은 가운데에서 스크롤, 삭제 버튼은 패널 하단(지도·대화창과 같은 선)에 고정 */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          paddingBottom: '42px', // Figma: 삭제 버튼이 패널 하단에서 42px 위에 위치
        }}
      >
        <ul
          className={styles.routeListContainer}
          style={{ flex: 1, minHeight: 0, maxHeight: 'none' }}
        >
          {travelRoute.slice(0, visibleCount).map((place, index) => (
            // 같은 장소가 두 번 있을 수 있어 placeId만으로는 key가 겹친다
            <PlaceItem
              key={`${place.placeId}-${index}`}
              place={place}
              index={index}
            />
          ))}
          <li ref={ref} style={{ height: '1px', listStyle: 'none' }} />
        </ul>
        <DeleteDropZone />
      </div>
    </DndProvider>
  );
};

export default ScheduleRoute;
