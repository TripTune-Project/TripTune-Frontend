import React, { useEffect, useRef } from 'react';
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

const Map: React.FC<MapProps> = ({ places }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  useEffect(() => {
    if (mapRef.current && places.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        bounds.extend(new google.maps.LatLng(place.latitude, place.longitude));
      });
      
      if (mapRef.current) {
        mapRef.current.fitBounds(bounds);
        
        google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
          if (mapRef.current) {
            const zoom = mapRef.current.getZoom();
            if (zoom !== undefined && zoom > 10) {
              mapRef.current.setZoom(10);
            }
          }
        });
      }
    }
  }, [places]);
  
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={(map: google.maps.Map) => {
          mapRef.current = map;
        }}
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
