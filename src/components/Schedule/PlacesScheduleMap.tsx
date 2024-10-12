import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TravelPlace } from '@/types/travelType';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 37.5636, // 서울 중구의 위도
  lng: 126.9976, // 서울 중구의 경도
};

interface MapProps {
  places: TravelPlace[];
  markers: { lat: number; lng: number; name: string }[]; // 마커 정보 추가
}

const PlacesScheduleMap = ({ places, markers }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  const loadGoogleMapsScript = useCallback(() => {
    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.id = 'google-maps-script';
      script.async = true;
      script.onload = () => {
        setIsMapLoaded(true);
      };
      script.onerror = () => {
        console.error('Google Maps API 로드에 실패했습니다.');
      };
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
      });
    }
  }, []);
  
  useEffect(() => {
    loadGoogleMapsScript();
    
    return () => {
      if (mapRef.current) {
        google.maps.event.clearInstanceListeners(mapRef.current);
        mapRef.current = null;
      }
    };
  }, [loadGoogleMapsScript]);
  
  useEffect(() => {
    if (isMapLoaded) {
      initializeMap();
    }
  }, [isMapLoaded, initializeMap]);
  
  useEffect(() => {
    const map = mapRef.current;
    if (map && isMapLoaded && Array.isArray(markers) && markers.length > 0) {
      markers.forEach((marker) => {
        new google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map,
          title: marker.name,
        });
      });
    }
  }, [markers, isMapLoaded]);

  return <div ref={mapContainerRef} style={containerStyle} />;
};

export default PlacesScheduleMap;
