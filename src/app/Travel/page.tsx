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
}

const TravelPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('placeName');
  const [places, setPlaces] = useState<Place[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  const PAGE_SIZE = 5;
  
  useEffect(() => {
    fetchPlaces(currentPage, searchTerm, searchType);
  }, [currentPage, searchTerm, searchType]);
  
  const fetchPlaces = async (page: number, term: string, type: string) => {
    const allPlaces = [
      {
        placeId: 1,
        country: '한국',
        city: '서울',
        district: '영등포구',
        placeName: '여의도 한강공원',
        latitude: 37.5285,
        longitude: 126.9326,
      },
      {
        placeId: 2,
        country: '한국',
        city: '서울',
        district: '광진구',
        placeName: '뚝섬 한강공원',
        latitude: 37.5310,
        longitude: 127.0660,
      },
      {
        placeId: 3,
        country: '한국',
        city: '부산',
        district: '해운대구',
        placeName: '해운대 해수욕장',
        latitude: 35.1587,
        longitude: 129.1603,
      },
      {
        placeId: 4,
        country: '한국',
        city: '제주',
        district: '서귀포시',
        placeName: '성산일출봉',
        latitude: 33.4586,
        longitude: 126.9411,
      },
      {
        placeId: 5,
        country: '일본',
        city: '도쿄',
        district: '시부야구',
        placeName: '시부야 크로싱',
        latitude: 35.6595,
        longitude: 139.7004,
      },
      {
        placeId: 6,
        country: '일본',
        city: '오사카',
        district: '주오구',
        placeName: '도톤보리',
        latitude: 34.6687,
        longitude: 135.5019,
      },
      {
        placeId: 7,
        country: '미국',
        city: '뉴욕',
        district: '맨해튼',
        placeName: '센트럴 파크',
        latitude: 40.7851,
        longitude: -73.9683,
      },
      {
        placeId: 8,
        country: '미국',
        city: '로스앤젤레스',
        district: '할리우드',
        placeName: '할리우드 사인',
        latitude: 34.1341,
        longitude: -118.3215,
      },
      {
        placeId: 9,
        country: '프랑스',
        city: '파리',
        district: '1구',
        placeName: '에펠탑',
        latitude: 48.8584,
        longitude: 2.2945,
      },
      {
        placeId: 10,
        country: '프랑스',
        city: '니스',
        district: '알프마리팀',
        placeName: '프롬나드 데 장글레',
        latitude: 43.6958,
        longitude: 7.2719,
      },
      {
        placeId: 11,
        country: '영국',
        city: '런던',
        district: '웨스트민스터',
        placeName: '빅벤',
        latitude: 51.5007,
        longitude: -0.1246,
      },
      {
        placeId: 12,
        country: '영국',
        city: '에든버러',
        district: '구시가',
        placeName: '에든버러 성',
        latitude: 55.9486,
        longitude: -3.1999,
      },
      {
        placeId: 13,
        country: '중국',
        city: '베이징',
        district: '차오양구',
        placeName: '만리장성',
        latitude: 40.4319,
        longitude: 116.5704,
      },
      {
        placeId: 14,
        country: '중국',
        city: '상하이',
        district: '푸동신구',
        placeName: '와이탄',
        latitude: 31.2400,
        longitude: 121.4909,
      },
      {
        placeId: 15,
        country: '독일',
        city: '베를린',
        district: '미테',
        placeName: '브란덴부르크 문',
        latitude: 52.5163,
        longitude: 13.3777,
      },
      {
        placeId: 16,
        country: '독일',
        city: '뮌헨',
        district: '알슈타트',
        placeName: '마리엔 광장',
        latitude: 48.1374,
        longitude: 11.5755,
      },
      {
        placeId: 17,
        country: '이탈리아',
        city: '로마',
        district: '트레비구',
        placeName: '트레비 분수',
        latitude: 41.9009,
        longitude: 12.4833,
      },
      {
        placeId: 18,
        country: '이탈리아',
        city: '베니스',
        district: '산마르코',
        placeName: '산 마르코 광장',
        latitude: 45.4340,
        longitude: 12.3388,
      },
      {
        placeId: 19,
        country: '스페인',
        city: '바르셀로나',
        district: '에이샴플라',
        placeName: '사그라다 파밀리아',
        latitude: 41.4036,
        longitude: 2.1744,
      },
      {
        placeId: 20,
        country: '스페인',
        city: '마드리드',
        district: '살라망카',
        placeName: '레티로 공원',
        latitude: 40.4154,
        longitude: -3.6846,
      },
    ];
    
    const filteredPlaces = allPlaces.filter((place) => {
      if (type === 'placeName') {
        return place.placeName.toLowerCase().includes(term.toLowerCase());
      } else if (type === 'country') {
        return place.country.toLowerCase().includes(term.toLowerCase());
      } else if (type === 'city') {
        return place.city.toLowerCase().includes(term.toLowerCase());
      }
      return false;
    });
    
    const startIndex = (page - 1) * PAGE_SIZE;
    const paginatedPlaces = filteredPlaces.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    );
    
    setPlaces(paginatedPlaces);
    setTotalPages(Math.ceil(filteredPlaces.length / PAGE_SIZE));
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  
  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSearchType(event.target.value);
    setSearchTerm('');
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%', padding: '20px', overflowY: 'scroll' }}>
        <h1>Place List</h1>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            style={{
              padding: '10px',
              marginRight: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <option value="placeName">장소명</option>
            <option value="country">국가명</option>
            <option value="city">도시명</option>
          </select>
          <input
            type="text"
            placeholder={`검색할 ${searchType === 'placeName' ? '장소명' : searchType === 'country' ? '국가명' : '도시명'}을 입력하세요`}
            value={searchTerm}
            onChange={handleSearch}
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <button
            onClick={() => console.log('Search button clicked')}
            style={{
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            <Image
              src={searchIcon}
              alt="돋보기 아이콘"
              width={20}
              height={20}
              priority
            />
          </button>
        </div>
        <ul>
          {places.map((place) => (
            <li key={place.placeId}>
              <h2>{place.placeName}</h2>
              <p>
                {place.country} - {place.city} - {place.district}
              </p>
            </li>
          ))}
        </ul>
        <Pagination
          total={totalPages * PAGE_SIZE}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </div>
      <div style={{ width: '50%' }}>
        <Map places={places} />
      </div>
    </div>
  );
};

export default TravelPage;
