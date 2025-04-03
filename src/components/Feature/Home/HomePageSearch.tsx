import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import searchIcon from '../../../../public/assets/images/메인화면/main_searchIcon.png';
import styles from '@/styles/onBoard.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const HomePageSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Snackbar 상태 관리
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('warning');
  
  const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };
  
  // 검색어가 있을 경우 검색창에 자동으로 포커스를 부여
  useEffect(() => {
    if (searchTerm.trim()) {
      inputRef.current?.focus();
    }
  }, [searchTerm]);
  
  // 검색어가 없다면 행동 하지 X!
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    router.push(`/Travel?keyword=${encodeURIComponent(searchTerm.trim())}`);
  };
  
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9 ]*$/;
    
    if (regex.test(input)) {
      setSearchTerm(input);
    } else {
      setAlertMessage('특수문자는 사용할 수 없습니다. 다른 검색어를 입력해 주세요.');
      setAlertSeverity('warning');
      setAlertOpen(true);
    }
  };
  
  const handleSearchKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <>
      <div className={styles.onBoardingSearch}>
        <input
          ref={inputRef}
          type="text"
          placeholder="원하는 여행지를 검색하세요."
          value={searchTerm}
          onChange={handleSearchInputChange}
          onKeyPress={handleSearchKeyPress}
          className={styles.searchInput}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          <Image
            src={searchIcon}
            alt="돋보기 아이콘"
            width={20}
            height={20}
            style={{ marginLeft: '25px' }}
          />
        </button>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HomePageSearch;
