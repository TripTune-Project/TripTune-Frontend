import React, { useCallback, useEffect, useRef, useState } from 'react';

const containerStyle = {
  width: '1497px',
  height: '393px',
  margin: '100px auto',
};

interface MapProps {
  latitude: number;
  longitude: number;
}

const DetailPlaceMap = ({ latitude, longitude }: MapProps) => {
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
        initializeMap();
      };
      script.onerror = () => {
        console.error('Google Maps API 로드에 실패했습니다.');
      };
      document.head.appendChild(script);
    } else if (window.google && mapContainerRef.current && !mapRef.current) {
      setIsMapLoaded(true);
      initializeMap();
    }
  }, []);

  const initializeMap = useCallback(() => {
    if (mapContainerRef.current && !mapRef.current && window.google) {
      mapRef.current = new google.maps.Map(mapContainerRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 16,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID
      });

      new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: mapRef.current,
        title: '현재 위치',
      });
    }
  }, [latitude, longitude]);

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

  return <div ref={mapContainerRef} style={containerStyle} />;
};

export default DetailPlaceMap;
