"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/Travel/Pagination';
import Map from '../../components/Travel/Map';
import Image from 'next/image';
import searchIcon from '../../../public/assets/images/search-icon.png';
import { fetchTravelListSearch } from '@/api/travelListSearchApi';
import { fetchTravelListByLocation } from '@/api/travelListApi';
import styles from '../../styles/Travel.module.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import DataLoading from '../../components/Common/DataLoading';

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
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('placeName');
  const [places, setPlaces] = useState<Place[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const checkAuthStatus = useCallback(() => {
    const accessToken = Cookies.get('trip-tune_at');
    const refreshToken = Cookies.get('trip-tune_rt');
    
    if (!accessToken || !refreshToken) {
      router.push(`/Login?next=${encodeURIComponent('/Travel')}`);
    }
  }, [router]);
  
  useEffect(() => {
    checkAuthStatus();
    requestUserLocation();
  }, [checkAuthStatus]);
  
  useEffect(() => {
    if (userCoordinates) {
      if (isSearching) {
        fetchPlacesBySearch(searchTerm, searchType);
      } else {
        fetchPlacesByLocation(currentPage, userCoordinates.latitude, userCoordinates.longitude);
      }
    }
  }, [userCoordinates, currentPage, isSearching, searchTerm, searchType]);
  
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
          setUserCoordinates({ latitude: 37.5642, longitude: 126.9976 });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setUserCoordinates({ latitude: 37.5642, longitude: 126.9976 });
    }
  };
  
  const fetchPlacesByLocation = async (page: number, latitude: number, longitude: number) => {
    setIsLoading(true);
    try {
      const response = await fetchTravelListByLocation({ latitude, longitude }, page);
      if (response.success && 'data' in response && Array.isArray(response.data.content)) {
        const mappedPlaces: Place[] = response.data.content.map((place) => ({
          placeId: place.placeId,
          country: place.country,
          city: place.city,
          district: place.district,
          placeName: place.placeName,
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.address,
          detailAddress: place.detailAddress || '',
          thumbnailUrl: place.thumbnailUrl || '',
        }));
        setPlaces(mappedPlaces);
        setTotalPages(response.data.totalPages);
      } else {
        setPlaces([]);
        setTotalPages(0);
      }
    } catch (error) {
      setPlaces([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchPlacesBySearch = async (term: string, type: string) => {
    setIsLoading(true);
    try {
      const response = await fetchTravelListSearch({ type, keyword: term });
      if (response.success && 'data' in response && Array.isArray(response.data.content)) {
        const mappedPlaces: Place[] = response.data.content.map((place) => ({
          placeId: place.placeId,
          country: place.country,
          city: place.city,
          district: place.district,
          placeName: place.placeName,
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.address,
          detailAddress: place.detailAddress || '',
          thumbnailUrl: place.thumbnailUrl || '',
        }));
        setPlaces(mappedPlaces);
        setTotalPages(response.data.totalPages);
      } else {
        setPlaces([]);
        setTotalPages(0);
      }
    } catch (error) {
      setPlaces([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
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
        <DataLoading />
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
          <ul className={styles.placeList}>
            {places.map((place) => (
              <li key={place.placeId} className={styles.placeItem}>
                <div className={styles.placeThumbnail}>
                  {place.thumbnailUrl ? (
                    <Image src={place.thumbnailUrl} alt={place.placeName} width={200} height={200} className={styles.thumbnailImage} />
                  ) : (
                    <div className={styles.noImage}>이미지 없음</div>
                  )}
                </div>
                <div className={styles.placeInfo}>
                  <h2 className={styles.placeName}>{place.placeName}</h2>
                  <p className={styles.placeAddress}>{`${place.country} / ${place.city} / ${place.district}`}</p>
                  <p className={styles.placeDetailAddress}>{place.address} {place.detailAddress}</p>
                </div>
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
