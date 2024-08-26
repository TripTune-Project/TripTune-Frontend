'use client';

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
      },
      {
        placeId: 2,
        country: '한국',
        city: '서울',
        district: '광진구',
        placeName: '뚝섬 한강공원',
      },
      {
        placeId: 3,
        country: '한국',
        city: '부산',
        district: '해운대구',
        placeName: '해운대 해수욕장',
      },
      {
        placeId: 4,
        country: '한국',
        city: '제주',
        district: '서귀포시',
        placeName: '성산일출봉',
      },
      {
        placeId: 5,
        country: '일본',
        city: '도쿄',
        district: '시부야구',
        placeName: '시부야 크로싱',
      },
      {
        placeId: 6,
        country: '일본',
        city: '오사카',
        district: '주오구',
        placeName: '도톤보리',
      },
      {
        placeId: 7,
        country: '미국',
        city: '뉴욕',
        district: '맨해튼',
        placeName: '센트럴 파크',
      },
      {
        placeId: 8,
        country: '미국',
        city: '로스앤젤레스',
        district: '할리우드',
        placeName: '할리우드 사인',
      },
      {
        placeId: 9,
        country: '프랑스',
        city: '파리',
        district: '1구',
        placeName: '에펠탑',
      },
      {
        placeId: 10,
        country: '프랑스',
        city: '니스',
        district: '알프마리팀',
        placeName: '프롬나드 데 장글레',
      },
      {
        placeId: 11,
        country: '영국',
        city: '런던',
        district: '웨스트민스터',
        placeName: '빅벤',
      },
      {
        placeId: 12,
        country: '영국',
        city: '에든버러',
        district: '구시가',
        placeName: '에든버러 성',
      },
      {
        placeId: 13,
        country: '중국',
        city: '베이징',
        district: '차오양구',
        placeName: '만리장성',
      },
      {
        placeId: 14,
        country: '중국',
        city: '상하이',
        district: '푸동신구',
        placeName: '와이탄',
      },
      {
        placeId: 15,
        country: '독일',
        city: '베를린',
        district: '미테',
        placeName: '브란덴부르크 문',
      },
      {
        placeId: 16,
        country: '독일',
        city: '뮌헨',
        district: '알슈타트',
        placeName: '마리엔 광장',
      },
      {
        placeId: 17,
        country: '이탈리아',
        city: '로마',
        district: '트레비구',
        placeName: '트레비 분수',
      },
      {
        placeId: 18,
        country: '이탈리아',
        city: '베니스',
        district: '산마르코',
        placeName: '산 마르코 광장',
      },
      {
        placeId: 19,
        country: '스페인',
        city: '바르셀로나',
        district: '에이샴플라',
        placeName: '사그라다 파밀리아',
      },
      {
        placeId: 20,
        country: '스페인',
        city: '마드리드',
        district: '살라망카',
        placeName: '레티로 공원',
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
      startIndex + PAGE_SIZE
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
    event: React.ChangeEvent<HTMLSelectElement>
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
            <option value='placeName'>장소명</option>
            <option value='country'>국가명</option>
            <option value='city'>도시명</option>
          </select>
          <input
            type='text'
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
              alt='돋보기 아이콘'
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
        <Map />
      </div>
    </div>
  );
};

export default TravelPage;
