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
  {
    placeId: 1,
    country: '대한민국',
    city: '서울',
    district: '영등포구',
    address: '서울특별시 영등포구 여의도동',
    detailAddress: '여의도 한강공원',
    latitude: 37.5285,
    longitude: 126.9326,
    placeName: '여의도 한강공원',
    thumbnailUrl: '',
  },
  {
    placeId: 2,
    country: '대한민국',
    city: '서울',
    district: '광진구',
    address: '서울특별시 광진구 자양동',
    detailAddress: '뚝섬 한강공원',
    latitude: 37.5310,
    longitude: 127.0660,
    placeName: '뚝섬 한강공원',
    thumbnailUrl: '',
  },
  {
    placeId: 3,
    country: '대한민국',
    city: '부산',
    district: '해운대구',
    address: '부산광역시 해운대구 중동',
    detailAddress: '해운대 해수욕장',
    latitude: 35.1587,
    longitude: 129.1603,
    placeName: '해운대 해수욕장',
    thumbnailUrl: '',
  },
  {
    placeId: 4,
    country: '대한민국',
    city: '제주',
    district: '서귀포시',
    address: '제주특별자치도 서귀포시 성산읍',
    detailAddress: '성산일출봉',
    latitude: 33.4586,
    longitude: 126.9411,
    placeName: '성산일출봉',
    thumbnailUrl: '',
  },
  {
    placeId: 5,
    country: '일본',
    city: '도쿄',
    district: '시부야구',
    address: '도쿄도 시부야구 우다가와초',
    detailAddress: '시부야 크로싱',
    latitude: 35.6595,
    longitude: 139.7004,
    placeName: '시부야 크로싱',
    thumbnailUrl: '',
  },
  {
    placeId: 6,
    country: '일본',
    city: '오사카',
    district: '주오구',
    address: '오사카부 오사카시 주오구',
    detailAddress: '도톤보리',
    latitude: 34.6687,
    longitude: 135.5019,
    placeName: '도톤보리',
    thumbnailUrl: '',
  },
  {
    placeId: 7,
    country: '미국',
    city: '뉴욕',
    district: '맨해튼',
    address: 'New York, NY 10024',
    detailAddress: '센트럴 파크',
    latitude: 40.7851,
    longitude: -73.9683,
    placeName: '센트럴 파크',
    thumbnailUrl: '',
  },
  {
    placeId: 8,
    country: '미국',
    city: '로스앤젤레스',
    district: '할리우드',
    address: 'Los Angeles, CA 90068',
    detailAddress: '할리우드 사인',
    latitude: 34.1341,
    longitude: -118.3215,
    placeName: '할리우드 사인',
    thumbnailUrl: '',
  },
  {
    placeId: 9,
    country: '프랑스',
    city: '파리',
    district: '1구',
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris',
    detailAddress: '에펠탑',
    latitude: 48.8584,
    longitude: 2.2945,
    placeName: '에펠탑',
    thumbnailUrl: '',
  },
  {
    placeId: 10,
    country: '프랑스',
    city: '니스',
    district: '알프마리팀',
    address: 'Prom. des Anglais, 06000 Nice',
    detailAddress: '프롬나드 데 장글레',
    latitude: 43.6958,
    longitude: 7.2719,
    placeName: '프롬나드 데 장글레',
    thumbnailUrl: '',
  },
  {
    placeId: 11,
    country: '영국',
    city: '런던',
    district: '웨스트민스터',
    address: 'Westminster, London SW1A 0AA',
    detailAddress: '빅벤',
    latitude: 51.5007,
    longitude: -0.1246,
    placeName: '빅벤',
    thumbnailUrl: '',
  },
  {
    placeId: 12,
    country: '영국',
    city: '에든버러',
    district: '구시가',
    address: 'Castlehill, Edinburgh EH1 2NG',
    detailAddress: '에든버러 성',
    latitude: 55.9486,
    longitude: -3.1999,
    placeName: '에든버러 성',
    thumbnailUrl: '',
  },
  {
    placeId: 13,
    country: '중국',
    city: '베이징',
    district: '차오양구',
    address: 'Huairou District, China, 101405',
    detailAddress: '만리장성',
    latitude: 40.4319,
    longitude: 116.5704,
    placeName: '만리장성',
    thumbnailUrl: '',
  },
  {
    placeId: 14,
    country: '중국',
    city: '상하이',
    district: '푸동신구',
    address: 'Zhongshan East 1st Rd, Waitan, Huangpu, Shanghai, China',
    detailAddress: '와이탄',
    latitude: 31.2400,
    longitude: 121.4909,
    placeName: '와이탄',
    thumbnailUrl: '',
  },
  {
    placeId: 15,
    country: '독일',
    city: '베를린',
    district: '미테',
    address: 'Pariser Platz, 10117 Berlin',
    detailAddress: '브란덴부르크 문',
    latitude: 52.5163,
    longitude: 13.3777,
    placeName: '브란덴부르크 문',
    thumbnailUrl: '',
  },
  {
    placeId: 16,
    country: '독일',
    city: '뮌헨',
    district: '알슈타트',
    address: 'Marienplatz, 80331 München',
    detailAddress: '마리엔 광장',
    latitude: 48.1374,
    longitude: 11.5755,
    placeName: '마리엔 광장',
    thumbnailUrl: '',
  },
  {
    placeId: 17,
    country: '이탈리아',
    city: '로마',
    district: '트레비구',
    address: 'Piazza di Trevi, 00187 Roma RM',
    detailAddress: '트레비 분수',
    latitude: 41.9009,
    longitude: 12.4833,
    placeName: '트레비 분수',
    thumbnailUrl: '',
  },
  {
    placeId: 18,
    country: '이탈리아',
    city: '베니스',
    district: '산마르코',
    address: 'P.za San Marco, 30124 Venezia VE',
    detailAddress: '산 마르코 광장',
    latitude: 45.4340,
    longitude: 12.3388,
    placeName: '산 마르코 광장',
    thumbnailUrl: '',
  },
  {
    placeId: 19,
    country: '스페인',
    city: '바르셀로나',
    district: '에이샴플라',
    address: 'Carrer de Mallorca, 401, 08013 Barcelona',
    detailAddress: '사그라다 파밀리아',
    latitude: 41.4036,
    longitude: 2.1744,
    placeName: '사그라다 파밀리아',
    thumbnailUrl: '',
  },
  {
    placeId: 20,
    country: '스페인',
    city: '마드리드',
    district: '살라망카',
    address: 'Plaza de la Independencia, 7, 28001 Madrid',
    detailAddress: '레티로 공원',
    latitude: 40.4154,
    longitude: -3.6846,
    placeName: '레티로 공원',
    thumbnailUrl: '',
  },
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

const styles = {
  container: {
    display: 'flex',
    height: '100%',
  },
  listContainer: {
    width: '50%',
    padding: '20px',
    overflowY: 'scroll',
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
