'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Pagination from '../../components/Travel/Pagination';
import PlacesMap from '../../components/Travel/PlacesMap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DataLoading from '../../components/Common/DataLoading';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import useGeolocation from '@/hooks/useGeolocation';
import {
  useTravelListByLocation,
  useTravelListSearch,
} from '@/hooks/useTravel';
import styles from '../../styles/Travel.module.css';
import { useTravelStore } from '@/store/travelStore';
import { useDebounce } from '@/hooks/useDebounce';
import { BookMarkApi, BookMarkDeleteApi } from '@/api/bookMarkApi';
import bookMarkIcon from '../../../public/assets/icons/ic_bookmark.png';
import bookMarkIconNo from '../../../public/assets/icons/ic_bookmark_no.png';
import locationIcon from '../../../public/assets/icons/ic_location.png';

const TravelPage = () => {
  const router = useRouter();
  
  const {
    currentPage,
    searchTerm,
    isSearching,
    setCurrentPage,
    setSearchTerm,
    setIsSearching,
  } = useTravelStore();
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info');
  
  const { userCoordinates, errorMessage: geoErrorMessage, permissionState } = useGeolocation();
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const defaultCoordinates = {
    latitude: 37.5642135,
    longitude: 127.0016985,
  };
  
  const {
    data: locationData,
    isLoading: isLoadingLocation,
    refetch: refetchLocation,
  } = useTravelListByLocation(
    coordinates ?? defaultCoordinates,
    currentPage,
    !isSearching
  );
  
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    refetch: refetchSearch,
  } = useTravelListSearch(
    {
      keyword: searchTerm,
      latitude: coordinates?.latitude ?? 0,
      longitude: coordinates?.longitude ?? 0,
    },
    currentPage,
    isSearching
  );
  
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  
  useEffect(() => {
    if (permissionState === 'granted' && userCoordinates) {
      setCoordinates(userCoordinates);
    } else if (permissionState === 'denied' || geoErrorMessage) {
      setCoordinates(defaultCoordinates);
      if (geoErrorMessage) {
        setAlertMessage(geoErrorMessage);
        setAlertSeverity('warning');
        setAlertOpen(true);
      }
    }
  }, [permissionState, userCoordinates, geoErrorMessage]);
  
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
      refetchSearch();
    } else if (debouncedSearchTerm === '') {
      setIsSearching(false);
      refetchLocation();
    }
  }, [debouncedSearchTerm, refetchSearch, refetchLocation, setCurrentPage, setIsSearching]);
  
  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
      refetchSearch();
    } else {
      alert('검색어를 입력해주세요.');
    }
  }, [searchTerm, setIsSearching, setCurrentPage, refetchSearch]);
  
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]*$/;
    
    if (regex.test(input)) {
      setSearchTerm(input);
    } else {
      alert('특수문자는 사용할 수 없습니다. 다른 검색어를 입력해 주세요.');
    }
  };
  
  const handleSearchInputBlur = useCallback(() => {
    if (searchTerm.trim() === '') {
      setIsSearching(false);
      setCurrentPage(1);
      refetchLocation();
    }
  }, [searchTerm, setIsSearching, setCurrentPage, refetchLocation]);
  
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    refetchLocation();
  }, [setSearchTerm, setIsSearching, setCurrentPage, refetchLocation]);
  
  const toggleBookmark = useCallback(async (placeId: number, isBookmarked = false) => {
    try {
      if (isBookmarked) {
        await BookMarkDeleteApi({ placeId });
        setAlertMessage('북마크가 해제되었습니다.');
      } else {
        await BookMarkApi({ placeId });
        setAlertMessage('북마크가 등록되었습니다.');
      }
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage('북마크 처리 중 오류가 발생했습니다.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  }, []);
  
  const handleAlertClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  }, []);
  
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
  
  const places = isSearching
    ? searchData?.data?.content
    : locationData?.data?.content;
  
  const totalPages = isSearching
    ? searchData?.data?.totalPages ?? 0
    : locationData?.data?.totalPages ?? 0;
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, [setCurrentPage]);
  
  return (
    <>
      <Head>
        <title>여행지 탐색 | 검색 리스트 조회</title>
        <meta
          name="description"
          content="여행지를 검색하고 위치를 기반으로 추천받아보세요. 원하는 키워드로 검색하거나 내 위치에서 가까운 여행지를 찾아볼 수 있습니다."
        />
        <meta
          name="keywords"
          content="여행, 여행지 검색, 위치 기반 추천, 내 위치, 여행지 추천, 여행 정보"
        />
        <meta property="og:title" content="여행지 탐색 | 검색 리스트 조회" />
        <meta
          property="og:description"
          content="여행지를 검색하고 위치를 기반으로 추천받아보세요. 원하는 키워드로 검색하거나 내 위치에서 가까운 여행지를 찾아볼 수 있습니다."
        />
        <meta property="og:image" content="/assets/Logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.container}>
        {isLoadingLocation || isLoadingSearch ? (
          <DataLoading />
        ) : (
          <div className={styles.listContainer}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="원하는 여행지를 검색하세요."
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyPress={handleSearchKeyPress}
                onBlur={handleSearchInputBlur}
                className={styles.input}
              />
              <button onClick={handleSearch} className={styles.searchButton}>
                검색
              </button>
            </div>
            <ul className={styles.placeList}>
              {places && places.length > 0 ? (
                places.map((place) => {
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
                        <button
                          className={styles.bookmarkButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(place.placeId, place.isBookmarked ?? false);
                          }}
                        >
                          {place.isBookmarked ? (
                            <Image
                              src={bookMarkIcon}
                              alt="북마크"
                              width={16}
                              height={16}
                              priority
                            />
                          ) : (
                            <Image
                              src={bookMarkIconNo}
                              alt="북마크 해제"
                              width={16}
                              height={16}
                              priority
                            />
                          )}
                        </button>
                        <div className={styles.placeName}>{place.placeName}</div>
                        <p className={styles.placeAddress}>
                          {`${place.country} / ${place.city} / ${place.district}`}
                        </p>
                        <p className={styles.placeDetailAddress}>
                          <Image
                            src={locationIcon}
                            alt="장소"
                            width={15}
                            height={21}
                          />
                          &nbsp;
                          {place.address} {place.detailAddress}
                        </p>
                        <div className={styles.distanceInfo}>
                          <span>{walking}</span> | <span>{driving}</span>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <p className={styles.noResults}>검색 결과가 없습니다.</p>
              )}
            </ul>
            {places && places.length > 0 && totalPages > 0 && (
              <Pagination
                total={totalPages * 5}
                currentPage={currentPage}
                pageSize={5}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
        <div className={styles.mapContainer}>
          <PlacesMap places={places || []} />
        </div>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Alert onClose={handleAlertClose} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default TravelPage;
