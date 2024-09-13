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

const Map = ({ places }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState(defaultCenter);
  
  const loadGoogleMapsScript = useCallback(() => {
    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.id = 'google-maps-script';
      script.async = true;
      script.onload = () => {
        if (mapContainerRef.current) {
          const googleMap = new google.maps.Map(mapContainerRef.current, {
            center: defaultCenter,
            zoom: 16,
          });
          setMap(googleMap);
        }
      };
      script.onerror = () => {
        console.error('Google Maps API 로드에 실패했습니다.');
      };
      document.head.appendChild(script);
    } else {
      if (window.google && mapContainerRef.current) {
        const googleMap = new google.maps.Map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 16,
        });
        setMap(googleMap);
      }
    }
  }, []);
  
  useEffect(() => {
    if (map) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        const marker = new google.maps.Marker({
          position: { lat: place.latitude, lng: place.longitude },
          map,
          title: place.placeName,
        });
        bounds.extend(marker.getPosition() as google.maps.LatLng);
      });
      
      if (places.length > 0) {
        map.fitBounds(bounds);
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(16);
      }
      
      const zoomListener = google.maps.event.addListener(
        map,
        'zoom_changed',
        () => {
          const newZoom = map.getZoom();
          if (typeof newZoom === 'number') {
            setZoom(newZoom);
          }
        }
      );
      
      const centerListener = google.maps.event.addListener(
        map,
        'center_changed',
        () => {
          const newCenter = map.getCenter();
          if (newCenter) {
            setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
          }
        }
      );
      
      return () => {
        google.maps.event.removeListener(zoomListener);
        google.maps.event.removeListener(centerListener);
      };
    }
  }, [map, places]);
  
  useEffect(() => {
    loadGoogleMapsScript();
  }, [loadGoogleMapsScript]);
  
  return <div ref={mapContainerRef} style={containerStyle} />;
};

export default Map;
