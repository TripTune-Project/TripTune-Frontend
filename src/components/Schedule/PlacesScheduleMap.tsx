import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTravelStore } from '@/store/scheduleStore';

// 맵 컨테이너의 스타일
const containerStyle = {
  width: '844px',
  height: '989px',
  alignSelf: 'flex-start',
};

// 맵의 기본 중심 좌표 (서울 중심부)
const defaultCenter = {
  lat: 37.5636,
  lng: 126.9976,
};

function PlacesScheduleMap() {
  // 여행 일정에 추가된 장소를 가져옴
  const { addedPlaces } = useTravelStore();

  // 맵 컨테이너와 맵 객체를 관리하기 위한 ref
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // 맵이 로드되었는지 여부를 확인하는 상태
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 맵에 추가된 마커들을 관리하는 ref
  const markersRef = useRef<google.maps.Marker[]>([]);

  // 맵 스타일 ID를 환경변수에서 가져옴
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID;

  // Google Maps API 스크립트를 동적으로 로드하는 함수
  const loadGoogleMapsScript = useCallback(() => {
    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      // 스크립트가 없으면 새로 추가
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.id = 'google-maps-script';
      script.async = true;
      script.onload = () => setIsMapLoaded(true); // 스크립트 로드 완료 시 맵 로드 상태 업데이트
      script.onerror = () =>
        console.error('Google Maps API 로드에 실패했습니다.');
      document.head.appendChild(script);
    } else if (window.google && mapContainerRef.current && !mapRef.current) {
      // 스크립트가 이미 있으면 로드 완료 상태로 설정
      setIsMapLoaded(true);
    }
  }, []);

  // 맵을 초기화하는 함수
  const initializeMap = useCallback(() => {
    if (mapContainerRef.current && !mapRef.current && window.google) {
      // 맵 컨테이너에 Google Maps 객체를 생성
      mapRef.current = new google.maps.Map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 16,
        mapId: mapId,
      });
    }
  }, [mapId]);

  // 추가된 장소를 기준으로 맵의 마커를 업데이트하는 함수
  const updateMarkers = useCallback(() => {
    if (mapRef.current && isMapLoaded) {
      // 현재 맵의 모든 마커를 검사하여 삭제 또는 유지
      markersRef.current.forEach((marker) => {
        const markerLat = marker.getPosition()?.lat()?.toFixed(6);
        const markerLng = marker.getPosition()?.lng()?.toFixed(6);
        const existsInAddedPlaces = addedPlaces.some(
          (place) =>
            place.lat.toFixed(6) === markerLat &&
            place.lng.toFixed(6) === markerLng
        );

        if (!existsInAddedPlaces) {
          marker.setMap(null); // 맵에 없는 장소의 마커는 제거
        }
      });

      // 유지할 마커만 리스트에 남김
      markersRef.current = markersRef.current.filter((marker) => {
        const markerLat = marker.getPosition()?.lat()?.toFixed(6);
        const markerLng = marker.getPosition()?.lng()?.toFixed(6);
        return addedPlaces.some(
          (place) =>
            place.lat.toFixed(6) === markerLat &&
            place.lng.toFixed(6) === markerLng
        );
      });

      // 추가된 장소 중 기존에 없는 마커를 새로 생성
      addedPlaces.forEach((place) => {
        const existingMarker = markersRef.current.find(
          (marker) =>
            marker.getPosition()?.lat()?.toFixed(6) === place.lat.toFixed(6) &&
            marker.getPosition()?.lng()?.toFixed(6) === place.lng.toFixed(6)
        );

        if (!existingMarker) {
          const marker = new google.maps.Marker({
            map: mapRef.current,
            position: { lat: place.lat, lng: place.lng },
          });
          markersRef.current.push(marker); // 새로운 마커 추가
        }
      });

      // 마지막으로 추가된 장소를 중심으로 맵 이동
      if (addedPlaces.length > 0) {
        const lastPlace = addedPlaces[addedPlaces.length - 1];
        mapRef.current.panTo({ lat: lastPlace.lat, lng: lastPlace.lng });
      }
    }
  }, [addedPlaces, isMapLoaded]);

  // 컴포넌트가 마운트되면 Google Maps API를 로드
  useEffect(() => {
    loadGoogleMapsScript();

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 마커 초기화
      if (mapRef.current) {
        google.maps.event.clearInstanceListeners(mapRef.current);
        mapRef.current = null;
      }
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [loadGoogleMapsScript]);

  // 맵 로드 상태가 true가 되면 맵 초기화
  useEffect(() => {
    if (isMapLoaded) {
      initializeMap();
    }
  }, [isMapLoaded, initializeMap]);

  // 추가된 장소 목록이 변경될 때마다 마커 업데이트
  useEffect(() => {
    updateMarkers();
  }, [addedPlaces, updateMarkers]);

  // 맵 컨테이너를 렌더링
  return <div ref={mapContainerRef} style={containerStyle} />;
}

export default PlacesScheduleMap;
