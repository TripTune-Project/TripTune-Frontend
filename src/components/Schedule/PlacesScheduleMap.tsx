import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTravelStore } from '@/store/scheduleStore';

const containerStyle = {
  width: '844px',
  height: '100%',
};

const defaultCenter = {
  lat: 37.5636,
  lng: 126.9976,
};

function PlacesScheduleMap() {
  const { addedPlaces } = useTravelStore(); // Zustand 상태 사용
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID;
  
  const loadGoogleMapsScript = useCallback(() => {
    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker`;
      script.id = 'google-maps-script';
      script.async = true;
      script.onload = () => setIsMapLoaded(true);
      script.onerror = () =>
        console.error('Google Maps API 로드에 실패했습니다.');
      document.head.appendChild(script);
    } else if (window.google && mapContainerRef.current && !mapRef.current) {
      setIsMapLoaded(true);
    }
  }, []);
  
  const initializeMap = useCallback(() => {
    if (mapContainerRef.current && !mapRef.current && window.google) {
      mapRef.current = new google.maps.Map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 16,
        mapId: mapId,
      });
    }
  }, [mapId]);
  
  const updateMarkers = useCallback(() => {
    if (mapRef.current && isMapLoaded) {
      // 기존 마커 제거
      markersRef.current.forEach((marker) => marker.map = null);
      markersRef.current = [];
      
      // 새 마커 추가
      addedPlaces.forEach((place) => {
        const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position: { lat: place.lat, lng: place.lng }, // LatLng 객체 올바르게 생성
        });
        markersRef.current.push(advancedMarker);
      });
      
      // 마지막 마커로 지도 중심 이동
      const lastPlace = Array.from(addedPlaces).pop();
      if (lastPlace) {
        mapRef.current.setCenter({
          lat: lastPlace.lat,
          lng: lastPlace.lng,
        });
      }
    }
  }, [addedPlaces, isMapLoaded]);
  
  useEffect(() => {
    loadGoogleMapsScript();
    
    return () => {
      if (mapRef.current) {
        google.maps.event.clearInstanceListeners(mapRef.current);
        mapRef.current = null;
      }
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];
    };
  }, [loadGoogleMapsScript]);
  
  useEffect(() => {
    if (isMapLoaded) {
      initializeMap();
    }
  }, [isMapLoaded, initializeMap]);
  
  useEffect(() => {
    updateMarkers();
  }, [addedPlaces, updateMarkers]);
  
  return <div ref={mapContainerRef} style={containerStyle} />;
}

export default PlacesScheduleMap;
