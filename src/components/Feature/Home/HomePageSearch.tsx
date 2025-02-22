import React, { useEffect, useRef, useState } from 'react';
import searchIcon from '../../../../public/assets/images/메인화면/main_searchIcon.png';
import DataLoading from '@/components/Common/DataLoading';
import { useTravelListSearch } from '@/hooks/useTravel';
import styles from '@/styles/onBoard.module.css';
import { useTravelStore } from '@/store/travelStore';
import { useDebounce } from '@/hooks/useDebounce';
import useAuth from '@/hooks/useAuth';
import Image from 'next/image';

const HomePageSearch = () => {
  const {
    currentPage,
    searchTerm,
    isSearching,
    setCurrentPage,
    setSearchTerm,
    setIsSearching,
  } = useTravelStore();

  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { isAuthenticated } = useAuth();
  const requiresAuth = !!isAuthenticated;

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
    requiresAuth,
    isSearching
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
      refetchSearch().finally(() => {
        if (debouncedSearchTerm.trim()) {
          inputRef.current?.focus();
        }
      });
    } else if (debouncedSearchTerm === '') {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, refetchSearch, setCurrentPage, setIsSearching]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
      refetchSearch();
    } else {
      alert('검색어를 입력해주세요.');
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]*$/;

    if (regex.test(input)) {
      setSearchTerm(input);
    } else {
      alert('특수문자는 사용할 수 없습니다. 다른 검색어를 입력해 주세요.');
    }
  };

  const handleSearchInputBlur = () => {
    if (searchTerm.trim() === '') {
      setIsSearching(false);
      setCurrentPage(1);
    }
  };

  const handleSearchKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <>
        {isLoadingSearch ? (
          <DataLoading />
        ) : (
          <div className={styles.onBoardingSearch}>
            <input
              ref={inputRef}
              type='text'
              placeholder='원하는 여행지를 검색하세요.'
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress}
              onBlur={handleSearchInputBlur}
              className={styles.searchInput}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              <Image
                src={searchIcon}
                alt='돋보기 아이콘'
                width={20}
                height={20}
                style={{ marginLeft: '25px' }}
              />
            </button>
          </div>
        )}
      </>
    </>
  );
};

export default HomePageSearch;
