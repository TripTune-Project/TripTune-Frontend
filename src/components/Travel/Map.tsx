import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState(defaultCenter);
  const [mapLoaded, setMapLoaded] = useState(false);
  
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
  
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      setMapBounds(mapRef.current);
    }
  }, [places, mapLoaded]);
  
  const handleZoomChanged = useCallback(() => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom();
      if (newZoom !== undefined && newZoom < 16) {
        mapRef.current.setZoom(16);
      } else if (newZoom !== zoom) {
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
