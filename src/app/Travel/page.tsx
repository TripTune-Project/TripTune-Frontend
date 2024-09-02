"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/Travel/Pagination';
import Map from '../../components/Travel/Map';
import Image from 'next/image';
import { fetchTravelListSearch } from '@/api/travelListSearchApi';
import { fetchTravelListByLocation } from '@/api/travelListApi';
import styles from '../../styles/Travel.module.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import DataLoading from '../../components/Common/DataLoading';
import LoginModal from '../../components/Common/LoginModal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('placeName');
  const [places, setPlaces] = useState<Place[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  const checkAuthStatus = useCallback(() => {
    const accessToken = Cookies.get('trip-tune_at');
    const refreshToken = Cookies.get('trip-tune_rt');
    
    if (!accessToken || !refreshToken) {
      setShowLoginModal(true);
      resetPlaces();
    }
  }, []);
  
  const checkGeolocationPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      switch (result.state) {
        case 'granted':
          setAlertMessage('위치 권한이 허용되었습니다.');
          setAlertSeverity('success');
          requestUserLocation();
          break;
        case 'prompt':
          setAlertMessage('위치 권한을 요청 중입니다.');
          setAlertSeverity('info');
          requestUserLocation();
          break;
        case 'denied':
          setAlertMessage('위치 권한이 차단되었습니다. 기본 위치를 사용합니다.');
          setAlertSeverity('warning');
          setUserCoordinates({ latitude: 37.5642, longitude: 126.9976 });
          break;
        default:
          break;
      }
      setAlertOpen(true);
    } catch (error) {
      console.error('위치 권한 상태 확인 오류:', error);
    }
  }, []);
  
  useEffect(() => {
    checkAuthStatus();
    checkGeolocationPermission();
  }, [checkAuthStatus, checkGeolocationPermission]);
  
  useEffect(() => {
    if (userCoordinates && !isSearching) {
      fetchPlaces();
    }
  }, [userCoordinates, currentPage, isSearching]);
  
  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          handleLocationError('위치 권한이 거부되었습니다. 기본 위치를 사용합니다.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      handleLocationError('브라우저가 위치 정보를 지원하지 않습니다. 기본 위치를 사용합니다.');
    }
  };
  
  const handleLocationError = (message: string) => {
    setAlertMessage(message);
    setAlertSeverity('warning');
    setAlertOpen(true);
    setUserCoordinates({ latitude: 37.5642, longitude: 126.9976 });
  };
  
  const fetchPlaces = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response: TravelListResponse = isSearching
        ? await fetchTravelListSearch({ type: searchType, keyword: searchTerm }, currentPage)
        : await fetchTravelListByLocation(
          { latitude: userCoordinates!.latitude, longitude: userCoordinates!.longitude },
          currentPage
        );
      
      if (response.success && response.data) {
        setPlaces(response.data.content);
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
  
  const resetPlaces = () => {
    setPlaces([]);
    setTotalPages(0);
    setCurrentPage(1);
    setSearchTerm('');
    setIsSearching(false);
  };
  
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };
  
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
    
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]*$/;
    
    if (regex.test(input)) {
      setSearchTerm(input);
    } else {
      alert('한글과 영어만 입력 가능합니다.');
    }
  };
  
  const handleSearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(event.target.value);
  };
  
  const handleResetSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    fetchPlaces();
  };
  
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    router.push(`/Login?next=${encodeURIComponent('/Travel')}`);
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
  
  return (
    <div className={styles.container}>
      {isLoading ? (
        <DataLoading />
      ) : errorMessage ? (
        <div className={styles.errorMessage}>{errorMessage}</div>
      ) : (
        <div className={styles.listContainer}>
          <div className={styles.searchContainer}>
            <select value={searchType} onChange={handleSearchTypeChange} className={styles.select}>
              <option value="placeName">장소명</option>
              <option value="country">국가명</option>
              <option value="city">도시명</option>
            </select>
            <input
              type="text"
              placeholder={`검색할 ${
                searchType === 'placeName' ? '장소명' : searchType === 'country' ? '국가명' : '도시명'
              }을 입력하세요`}
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
            {places.map((place) => (
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
                      width={200}
                      height={200}
                      className={styles.thumbnailImage}
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
                  <button
                    className={styles.contentBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetailClick(place.placeId);
                    }}
                  >
                    {place.placeName} 상세보기
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Pagination total={totalPages * 5} currentPage={currentPage} pageSize={5} onPageChange={handlePageChange} />
        </div>
      )}
      <div className={styles.mapContainer}>
        <Map places={places} />
      </div>
      {showLoginModal && <LoginModal onClose={handleCloseLoginModal} />}
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TravelPage;
