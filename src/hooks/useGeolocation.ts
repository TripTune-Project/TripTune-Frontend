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

  const handleLocationError = useCallback((message: string) => {
    setErrorMessage(message);
    setUserCoordinates({ latitude: 37.5642, longitude: 126.9976 });
  }, []);

  const requestUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          handleLocationError(
            '위치 권한이 거부되었습니다. 기본 위치를 사용합니다.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      handleLocationError(
        '브라우저가 위치 정보를 지원하지 않습니다. 기본 위치를 사용합니다.'
      );
    }
  }, [handleLocationError]);

  const handlePermissionChange = useCallback(
    (state: 'granted' | 'prompt' | 'denied') => {
      if (state === 'granted' || state === 'prompt') {
        requestUserLocation();
      } else if (state === 'denied') {
        setErrorMessage('위치 권한이 차단되었습니다. 기본 위치를 사용합니다.');
        setUserCoordinates({ latitude: 37.5642, longitude: 126.9976 });
      }
    },
    [requestUserLocation]
  );

  const checkGeolocationPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionState(result.state);
      handlePermissionChange(result.state);
    } catch (error) {
      console.error('위치 권한 상태 확인 오류:', error);
      setErrorMessage('위치 권한 상태 확인 중 오류가 발생했습니다.');
    }
  }, [handlePermissionChange]);

  useEffect(() => {
    checkGeolocationPermission();
  }, [checkGeolocationPermission]);

  return { userCoordinates, errorMessage, permissionState };
};

export default useGeolocation;
