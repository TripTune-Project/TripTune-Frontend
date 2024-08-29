"use client";

import { useState, useEffect } from 'react';
import Pagination from '../../components/Travel/Pagination';
import Map from '../../components/Travel/Map';
import Image from 'next/image';
import searchIcon from '../../../public/assets/images/search-icon.png';

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

const PAGE_SIZE = 5;

const allPlaces: Place[] = [
  // 기존 장소 데이터...
];

const TravelPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('placeName');
  const [places, setPlaces] = useState<Place[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchPlaces(currentPage, searchTerm, searchType);
  }, [currentPage, searchTerm, searchType]);
  
  const fetchPlaces = (page: number, term: string, type: string) => {
    const filteredPlaces = filterPlaces(allPlaces, term, type);
    const paginatedPlaces = paginatePlaces(filteredPlaces, page, PAGE_SIZE);
    
    setPlaces(paginatedPlaces);
    setTotalPages(Math.ceil(filteredPlaces.length / PAGE_SIZE));
  };
  
  const filterPlaces = (places: Place[], term: string, type: string) => {
    return places.filter((place) => {
      const searchValue = place[type as keyof Place]?.toString().toLowerCase() || '';
      return searchValue.includes(term.toLowerCase());
    });
  };
  
  const paginatePlaces = (places: Place[], page: number, pageSize: number) => {
    const startIndex = (page - 1) * pageSize;
    return places.slice(startIndex, startIndex + pageSize);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  
  const handleSearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(event.target.value);
    setSearchTerm('');
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.listContainer}>
        <div style={styles.searchContainer}>
          <select value={searchType} onChange={handleSearchTypeChange} style={styles.select}>
            <option value="placeName">장소명</option>
            <option value="country">국가명</option>
            <option value="city">도시명</option>
          </select>
          <input
            type="text"
            placeholder={`검색할 ${searchType === 'placeName' ? '장소명' : searchType === 'country' ? '국가명' : '도시명'}을 입력하세요`}
            value={searchTerm}
            onChange={handleSearch}
            style={styles.input}
          />
          <button onClick={() => console.log('Search button clicked')} style={styles.button}>
            <Image src={searchIcon} alt="돋보기 아이콘" width={20} height={20} priority />
          </button>
        </div>
        <ul>
          {places.map((place) => (
            <li key={place.placeId}>
              <h2>{place.placeName}</h2>
              <p>{`${place.country} - ${place.city} - ${place.district}`}</p>
              <p>{place.address} {place.detailAddress}</p>
              <Image src={place.thumbnailUrl} alt={place.placeName} width={100} height={100} />
            </li>
          ))}
        </ul>
        <Pagination total={totalPages * PAGE_SIZE} currentPage={currentPage} pageSize={PAGE_SIZE} onPageChange={handlePageChange} />
      </div>
      <div style={styles.mapContainer}>
        <Map places={places} />
      </div>
    </div>
  );
};

// 스타일 정의
const styles = {
  container: {
    display: 'flex',
    height: '100%',
  },
  listContainer: {
    width: '50%',
    padding: '20px',
    overflowY: 'scroll' as 'scroll', // 타입을 맞추기 위해 as 'scroll' 추가
  },
  searchContainer: {
    display: 'flex',
    marginBottom: '20px',
  },
  select: {
    padding: '10px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  mapContainer: {
    width: '50%',
  },
};

export default TravelPage;
