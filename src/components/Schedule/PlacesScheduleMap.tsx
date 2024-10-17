import React, { useEffect, useRef, useState, useCallback } from 'react';

const containerStyle = {
  width: '100%',
  height: '1330px',
};

const defaultCenter = {
  lat: 37.5636,
  lng: 126.9976,
};

interface MapProps {
  markers: { lat: number; lng: number; }[];
}

const PlacesScheduleMap = ({ markers }: MapProps) => {
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
      script.onerror = () => console.error('Google Maps API 로드에 실패했습니다.');
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
        mapId: mapId,  // 지도 스타일 ID 적용
      });
    }
  }, [mapId]);
  
  useEffect(() => {
    loadGoogleMapsScript();
    
    return () => {
      if (mapRef.current) {
        google.maps.event.clearInstanceListeners(mapRef.current);
        mapRef.current = null;
      }
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];
    };
  }, [loadGoogleMapsScript]);
  
  useEffect(() => {
    if (isMapLoaded) {
      initializeMap();
    }
  }, [isMapLoaded, initializeMap]);
  
  useEffect(() => {
    if (mapRef.current && isMapLoaded && markers.length > 0) {
      markers.forEach((marker, index) => {
        // 이미 존재하는 마커는 중복 추가하지 않음
        if (!markersRef.current[index]) {
          const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: { lat: marker.lat, lng: marker.lng },
          });
          markersRef.current.push(advancedMarker);
        }
      });
      
      // 마지막 마커의 위치로 지도 중심 이동
      const lastMarker = markers[markers.length - 1];
      mapRef.current.setCenter({ lat: lastMarker.lat, lng: lastMarker.lng });
    }
  }, [markers, isMapLoaded]);
  
  return <div ref={mapContainerRef} style={containerStyle} />;
};

export default PlacesScheduleMap;
