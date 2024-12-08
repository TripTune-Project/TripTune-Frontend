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
  const { addedPlaces } = useTravelStore();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STYLE_ID;
  
  const loadGoogleMapsScript = useCallback(() => {
    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
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
      markersRef.current.forEach((marker) => {
        const markerLat = marker.getPosition()?.lat()?.toFixed(6);
        const markerLng = marker.getPosition()?.lng()?.toFixed(6);
        const existsInAddedPlaces = addedPlaces.some(
          (place) =>
            place.lat.toFixed(6) === markerLat &&
            place.lng.toFixed(6) === markerLng
        );
        
        if (!existsInAddedPlaces) {
          marker.setMap(null);
        }
      });
      
      markersRef.current = markersRef.current.filter((marker) => {
        const markerLat = marker.getPosition()?.lat()?.toFixed(6);
        const markerLng = marker.getPosition()?.lng()?.toFixed(6);
        return addedPlaces.some(
          (place) =>
            place.lat.toFixed(6) === markerLat &&
            place.lng.toFixed(6) === markerLng
        );
      });
      
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
          markersRef.current.push(marker);
        }
      });
      
      if (addedPlaces.length > 0) {
        const lastPlace = addedPlaces[addedPlaces.length - 1];
        mapRef.current.panTo({ lat: lastPlace.lat, lng: lastPlace.lng });
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
      markersRef.current.forEach((marker) => marker.setMap(null));
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
