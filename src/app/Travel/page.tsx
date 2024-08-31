'use client';

import { useState, useEffect, useRef } from 'react';
import Pagination from '../../components/Travel/Pagination';
import Map from '../../components/Travel/Map';
import Image from 'next/image';
import searchIcon from '../../../public/assets/images/search-icon.png';
import { fetchTravelListSearch } from '@/api/travelListSearchApi';
import { fetchTravelListByLocation } from '@/api/travelListApi';
import styles from '../../styles/Travel.module.css';

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

const TravelPage = () => {
  // TODO : 페이지를 직접 처리 하면 되지만 버튼 동작에 대한 페이징 처리가 안됨
  // TODO : 사진과 좀 이쁘게 배치 할 수 있도록 하기
  // TODO : 검색을 할때도 페이지 LIST 보내주는게 필요한지
  // TODO : 사용자의 위치 지리에 따른 API 호출 인지 확인
  const [currentPage, setCurrentPage] = useState(1); // 이거 페이지 작동 안됨
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('placeName');
  const [places, setPlaces] = useState<Place[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoordinates, setUserCoordinates] = useState({ latitude: 37.5642, longitude: 126.9976 });
  const hasFetchedInitialData = useRef(false);
  
  useEffect(() => {
    requestUserLocation();
  }, []);
  
  useEffect(() => {
    if (!hasFetchedInitialData.current && userCoordinates.latitude && userCoordinates.longitude) {
      fetchPlacesByLocation(1, userCoordinates.latitude, userCoordinates.longitude);
      hasFetchedInitialData.current = true;
    }
  }, [userCoordinates.latitude, userCoordinates.longitude]);
  
  useEffect(() => {
    if (!hasFetchedInitialData.current) return;
    
    if (isSearching) {
      fetchPlacesBySearch(currentPage, searchTerm, searchType);
    } else {
      fetchPlacesByLocation(currentPage, userCoordinates.latitude, userCoordinates.longitude);
    }
  }, [currentPage, isSearching, searchTerm, searchType]);
  
  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('위치 권한 거부 또는 오류 발생:', error.message);
          setUserCoordinates({ latitude: 37.5642, longitude: 126.9976 });
        }
      );
    } else {
      setUserCoordinates({ latitude: 37.5642, longitude: 126.9976 });
    }
  };
  
  const fetchPlacesByLocation = async (page: number, latitude: number, longitude: number) => {
    setIsLoading(true);
    const params = {
      latitude,
      longitude,
    };
    
    try {
      const response = await fetchTravelListByLocation(params, page);
      if (response.success && response.data && Array.isArray(response.data.content)) {
        setPlaces(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        console.error(response.message);
        setPlaces([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('데이터 로드 중 오류 발생:', error);
      setPlaces([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchPlacesBySearch = async (page: number, term: string, type: string) => {
    setIsLoading(true);
    const params = {
      type,
      keyword: term,
    };
    
    try {
      const response = await fetchTravelListSearch(params);
      if (response.success && response.data && Array.isArray(response.data.content)) {
        setPlaces(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        console.error(response.message);
        setPlaces([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('데이터 로드 중 오류 발생:', error);
      setPlaces([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      setIsSearching(true);
      setCurrentPage(1);
    } else {
      alert('검색어를 입력해주세요.');
    }
  };
  
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(event.target.value);
  };
  
  const handleResetSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
  };
  
  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loading}>로딩 중...</div>
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
              placeholder={`검색할 ${searchType === 'placeName' ? '장소명' : searchType === 'country' ? '국가명' : '도시명'}을 입력하세요`}
              value={searchTerm}
              onChange={handleSearchInputChange}
              className={styles.input}
            />
            <button onClick={handleSearch} className={styles.button}>
              <Image src={searchIcon} alt="돋보기 아이콘" width={20} height={20} priority />
            </button>
            <button onClick={handleResetSearch} className={styles.resetButton}>
              찾기
            </button>
          </div>
          <ul>
            {Array.isArray(places) && places.map((place) => (
              <li key={place.placeId}>
                <h2>{place.placeName}</h2>
                <p>{`${place.country} - ${place.city} - ${place.district}`}</p>
                <p>{place.address} {place.detailAddress}</p>
                {place.thumbnailUrl ? (
                  <Image src={place.thumbnailUrl} alt={place.placeName} width={100} height={100} />
                ) : (
                  <div>이미지 없음</div>
                )}
              </li>
            ))}
          </ul>
          <Pagination
            total={totalPages * 5}
            currentPage={currentPage}
            pageSize={5}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      <div className={styles.mapContainer}>
        <Map places={places} />
      </div>
    </div>
  );
};

export default TravelPage;
