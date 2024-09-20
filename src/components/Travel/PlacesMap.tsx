import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TravelPlace } from '@/types/travelType';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 37.5636,
  lng: 126.9976,
};

interface MapProps {
  places: TravelPlace[];
}

const PlacesMap = ({ places }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState(defaultCenter);
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
    if (map && isMapLoaded) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        const marker = new google.maps.Marker({
          position: { lat: place.latitude, lng: place.longitude },
          map,
          title: place.placeName,
        });
        bounds.extend(marker.getPosition() as google.maps.LatLng);
      });
      map.fitBounds(bounds);
    }
  }, [places, isMapLoaded]);
  
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      const handleZoomChange = () => {
        const newZoom = map.getZoom();
        if (typeof newZoom === 'number') {
          setZoom(newZoom);
        }
      };
      
      const handleCenterChange = () => {
        const newCenter = map.getCenter();
        if (newCenter) {
          setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
        }
      };
      
      const zoomListener = map.addListener('zoom_changed', handleZoomChange);
      const centerListener = map.addListener(
        'center_changed',
        handleCenterChange
      );
      
      return () => {
        google.maps.event.removeListener(zoomListener);
        google.maps.event.removeListener(centerListener);
      };
    }
  }, []);
  
  return <div ref={mapContainerRef} style={containerStyle} />;
};

export default PlacesMap;
