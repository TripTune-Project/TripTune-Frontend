import React, { useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 37.5636,
  lng: 126.9976,
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
  
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (places.length > 0) {
      setMapBounds(map);
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(15);
    }
  };
  
  const setMapBounds = (map: google.maps.Map | null) => {
    if (!map || places.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      bounds.extend(new google.maps.LatLng(place.latitude, place.longitude));
    });
    
    map.fitBounds(bounds);
    
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      const zoom = map.getZoom();
      if (zoom !== undefined && zoom > 16) {
        map.setZoom(16);
      }
    });
  };
  
  useEffect(() => {
    if (mapRef.current) {
      setMapBounds(mapRef.current);
    }
  }, [places]);
  
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={15}
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
