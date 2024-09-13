import { useState, useEffect, useCallback } from 'react';
import { Coordinates } from '@/types';

const useGeolocation = () => {
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<
    'granted' | 'prompt' | 'denied' | null
  >(null);

  const requestUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setErrorMessage('위치 권한이 거부되었습니다.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setErrorMessage('브라우저가 위치 정보를 지원하지 않습니다.');
    }
  }, []);

  const checkGeolocationPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionState(result.state);
      if (result.state === 'granted' || result.state === 'prompt') {
        requestUserLocation();
      } else if (result.state === 'denied') {
        setErrorMessage('위치 권한이 차단되었습니다.');
      }
    } catch (error) {
      console.error('위치 권한 상태 확인 오류:', error);
      setErrorMessage('위치 권한 상태 확인 중 오류가 발생했습니다.');
    }
  }, [requestUserLocation]);

  useEffect(() => {
    checkGeolocationPermission();
  }, [checkGeolocationPermission]);

  return { userCoordinates, errorMessage, permissionState };
};

export default useGeolocation;
