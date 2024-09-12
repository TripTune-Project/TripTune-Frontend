import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
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
  const mapRef = useRef<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState(defaultCenter);
  
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    if (places.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        bounds.extend(new google.maps.LatLng(place.latitude, place.longitude));
      });
      map.fitBounds(bounds);
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(16);
    }
  }, [places]);
  
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      if (places.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
          bounds.extend(new google.maps.LatLng(place.latitude, place.longitude));
        });
        map.fitBounds(bounds);
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(16);
      }
    }
  }, [places]);
  
  const handleZoomChanged = useCallback(() => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom();
      if (typeof newZoom === 'number' && newZoom !== zoom) {
        setZoom(newZoom);
      }
    }
  }, [zoom]);
  
  const handleCenterChanged = useCallback(() => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        if (lat !== center.lat || lng !== center.lng) {
          setCenter({ lat, lng });
        }
      }
    }
  }, [center]);
  
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={zoom}
        onLoad={handleMapLoad}
        onZoomChanged={handleZoomChanged}
        onCenterChanged={handleCenterChanged}
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
