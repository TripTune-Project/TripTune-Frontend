import React, { useEffect, useRef, useState } from 'react';
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
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const setMapBounds = (map: google.maps.Map) => {
    if (!map || places.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      bounds.extend(new google.maps.LatLng(place.latitude, place.longitude));
    });
    
    map.fitBounds(bounds);
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined && currentZoom < 16) {
        map.setZoom(16);
      }
    });
  };
  
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
    if (places.length > 0) {
      setMapBounds(map);
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(16);
    }
  };
  
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      setMapBounds(mapRef.current);
    }
  }, [places, mapLoaded]);
  
  const handleZoomChanged = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom();
      
      if (typeof newZoom === 'number') {
        if (newZoom < 16) {
          mapRef.current.setZoom(16);
        } else if (newZoom !== zoom) {
          setZoom(newZoom);
        }
      } else {
        console.error('확대/축소 수준이 정의되지 않았거나 유효한 숫자가 아닙니다.');
      }
    }
  };
  
  const handleCenterChanged = () => {
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
  };
  
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
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
