'use client';

import React, { useState, useEffect } from 'react';
import Pagination from '../../components/Travel/Pagination';
import Map from '../../components/Travel/Map';
import Image from 'next/image';
import { fetchTravelListSearch } from '@/api/travelListSearchApi';
import { fetchTravelListByLocation } from '@/api/travelListApi';
import styles from '../../styles/Travel.module.css';
import { useRouter } from 'next/navigation';
import DataLoading from '../../components/Common/DataLoading';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import saveLocalContent from '@/utils/saveLocalContent';
import useGeolocation from '@/hooks/useGeolocation';

interface Place {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  latitude: number;
  longitude: number;
  address: string;
  detailAddress: string;
  thumbnailUrl: string;
  distance: number;
}

interface TravelListResponse {
  success: boolean;
  data?: {
    content: Place[];
    totalPages: number;
  };
}

const TravelPage = () => {
  const router = useRouter();
  const { setEncryptedCookie } = saveLocalContent();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  const resetPlaces = () => {
    setPlaces([]);
    setTotalPages(0);
    setCurrentPage(1);
    setSearchTerm('');
    setIsSearching(false);
  };
  
  const { userCoordinates, errorMessage: geoErrorMessage, permissionState } = useGeolocation();
  
  useEffect(() => {
    if (geoErrorMessage) {
      setAlertMessage(geoErrorMessage);
      setAlertSeverity('warning');
      setAlertOpen(true);
    }
  }, [geoErrorMessage]);
  
  useEffect(() => {
    if (userCoordinates && !isLoading) {
      fetchPlaces();
    }
  }, [userCoordinates, currentPage]);
  
  const fetchPlaces = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response: TravelListResponse = isSearching
        ? await fetchTravelListSearch({ keyword: searchTerm }, currentPage)
        : await fetchTravelListByLocation(
          { latitude: userCoordinates!.latitude, longitude: userCoordinates!.longitude },
          currentPage
        );
      
      if (response.success && response.data) {
        const processedPlaces = response.data.content.map((place) => ({
          ...place,
          distance: Math.floor(place.distance * 10) / 10,
        }));
        
        setPlaces(processedPlaces);
        setTotalPages(response.data.totalPages);
        if (response.data.content.length === 0) {
          setErrorMessage('검색 결과가 없습니다.');
        }
      } else {
        setErrorMessage('데이터를 불러오는 중 오류가 발생했습니다.');
        resetPlaces();
      }
    } catch {
      setErrorMessage('네트워크 에러가 발생했습니다. 다시 시도해주세요.');
      resetPlaces();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 0);
    }
  };
  
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 0);
  }, [currentPage]);
  
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
      fetchPlaces();
    } else {
      alert('검색어를 입력해주세요.');
    }
  };
  
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]*$/;
    
    if (regex.test(input)) {
      setSearchTerm(input);
    } else {
      alert('특수문자는 사용할 수 없습니다. 다른 검색어를 입력해 주세요.');
    }
  };
  
  const handleResetSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    fetchPlaces();
  };
  
  const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };
  
  const handleDetailClick = (placeId: number) => {
    router.push(`/Travel/${placeId}`);
  };
  
  const calculateTravelTime = (distance: number) => {
    if (isNaN(distance)) {
      return {
        walking: '도보 거리 정보 없음',
        driving: '차로 거리 정보 없음',
      };
    }
    
    const distanceInKm = Math.floor(distance * 10) / 10;
    const walkingSpeed = 5;
    const drivingSpeed = 50;
    
    const walkingTime = Math.round((distanceInKm / walkingSpeed) * 60);
    const drivingTime = Math.round((distanceInKm / drivingSpeed) * 60);
    
    return {
      walking: `도보 ${walkingTime}분 (${distanceInKm} km)`,
      driving: `차로 ${drivingTime}분 (${distanceInKm} km)`,
    };
  };
  
  return (
    <div className={styles.container}>
      {isLoading ? (
        <DataLoading />
      ) : errorMessage ? (
        <div className={styles.errorMessage}>{errorMessage}</div>
      ) : (
        <div className={styles.listContainer}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="검색할 키워드를 입력 해주세요."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className={styles.input}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              검색
            </button>
            <button onClick={handleResetSearch} className={styles.resetButton}>
              초기화
            </button>
          </div>
          <ul className={styles.placeList}>
            {places.map((place) => {
              const { walking, driving } = calculateTravelTime(place.distance);
              return (
                <li
                  key={place.placeId}
                  className={styles.placeItem}
                  onClick={() => handleDetailClick(place.placeId)}
                >
                  <div className={styles.placeThumbnail}>
                    {place.thumbnailUrl ? (
                      <Image
                        src={place.thumbnailUrl}
                        alt={place.placeName}
                        width={150}
                        height={150}
                        className={styles.thumbnailImage}
                        priority
                      />
                    ) : (
                      <div className={styles.noImage}>이미지 없음</div>
                    )}
                  </div>
                  <div className={styles.placeInfo}>
                    <h2 className={styles.placeName}>{place.placeName}</h2>
                    <p className={styles.placeAddress}>{`${place.country} / ${place.city} / ${place.district}`}</p>
                    <p className={styles.placeDetailAddress}>
                      {place.address} {place.detailAddress}
                    </p>
                    <div className={styles.timeAndDistance}>
                      <button
                        className={styles.contentBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetailClick(place.placeId);
                        }}
                      >
                        {place.placeName} 상세보기
                      </button>
                      <div className={styles.distanceInfo}>
                        <span>{walking}</span> | <span>{driving}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Pagination total={totalPages * 5} currentPage={currentPage} pageSize={5} onPageChange={handlePageChange} />
        </div>
      )}
      <div className={styles.mapContainer}>
        <Map places={places} />
      </div>
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TravelPage;
