import React, { useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 37.5665,
  lng: 126.978,
};

interface Place {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  places: Place[];
}

const Map = ({ places }: MapProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  
  useEffect(() => {
    if (!mapRef.current || places.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      bounds.extend(new google.maps.LatLng(place.latitude, place.longitude));
    });
    
    mapRef.current.fitBounds(bounds);
    
    google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
      const zoom = mapRef.current?.getZoom();
      if (zoom !== undefined && zoom > 13) {
        mapRef.current?.setZoom(13);
      }
    });
  }, [places]);
  
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={handleMapLoad}
      >
        {places.map((place) => (
          <Marker
            key={place.placeId}
            position={{ lat: place.latitude, lng: place.longitude }}
            title={place.placeName}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
