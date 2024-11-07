import { useState, useEffect } from 'react';
import { Coordinates } from '@/types';

const useGeolocation = () => {
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<
    'granted' | 'prompt' | 'denied' | null
  >(null);
  
  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setErrorMessage(null);
        },
        (error) => {
          setErrorMessage(
            '위치 권한이 거부되었습니다. 위치 서비스를 이용하려면 권한을 허용해주세요.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setErrorMessage(
        '현재 브라우저에서는 위치 정보를 지원하지 않습니다. 다른 브라우저를 사용해보세요.'
      );
    }
  };
  
  const checkGeolocationPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionState(result.state);
      if (result.state === 'granted' || result.state === 'prompt') {
        requestUserLocation();
      } else if (result.state === 'denied') {
        setErrorMessage(
          '위치 권한이 거부되었습니다. 위치 서비스를 이용하려면 권한을 허용해주세요. 현재 위치 권한이 거부되어 서울 중부의 위치를 사용 중입니다.'
        );
      }
      
      result.onchange = () => {
        setPermissionState(result.state);
        if (result.state === 'granted') {
          requestUserLocation();
        } else if (result.state === 'denied') {
          setUserCoordinates(null);
          setErrorMessage(
            '위치 권한이 거부되었습니다. 위치 서비스를 이용하려면 권한을 허용해주세요. 현재 위치 권한이 거부되어 서울 중부의 위치를 사용 중입니다.'
          );
        }
      };
    } catch (error) {
      console.error('위치 권한 상태 확인 오류:', error);
      setErrorMessage('위치 권한 상태 확인 중 오류가 발생했습니다.');
    }
  };
  
  useEffect(() => {
    checkGeolocationPermission();
  }, []);
  
  return { userCoordinates, errorMessage, permissionState };
};

export default useGeolocation;
