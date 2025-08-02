import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import searchIcon from '../../../../public/assets/images/메인화면/main_searchIcon.png';
import styles from '@/styles/onBoard.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { createSearchHandlers } from '@/utils/search';

/**
 * HomePageSearch 컴포넌트 - 홈페이지 검색 기능 구현
 * 주요 기능:
 * - 여행지 검색 입력 필드 및 검색 버튼 제공
 * - 검색어 입력 시 유효성 검사 수행
 * - 검색 결과로 Travel 페이지로 이동
 */
const HomePageSearch = () => {
  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Snackbar 상태 관리
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('warning');

  /**
   * 알림창 닫기 핸들러
   * @param event 이벤트 객체
   * @param reason 닫히는 이유
   */
  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setAlertOpen(false);
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertSeverity('warning');
    setAlertOpen(true);
  };

  const { handleInputChange, handleSearch, handleSearchKeyPress } = createSearchHandlers({
    searchTerm,
    setSearchTerm,
    onSearch: (term) => {
      router.push(`/Travel?keyword=${encodeURIComponent(term)}`);
    },
    showAlert,
  });

  // 검색어가 있을 경우 검색창에 자동으로 포커스를 부여
  useEffect(() => {
    if (searchTerm.trim()) {
      inputRef.current?.focus();
    }
  }, [searchTerm]);

  return (
    <>
      <div className={styles.onBoardingSearch}>
        <input
          ref={inputRef}
          type="text"
          placeholder="원하는 여행지를 검색해보세요."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleSearchKeyPress}
          className={styles.searchInput}
        />
      </div>
      <button className={styles.searchButton} onClick={handleSearch}>
        <Image
          src={searchIcon}
          alt="돋보기 아이콘"
          width={32}
          height={32}
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </button>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HomePageSearch;
