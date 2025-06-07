import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import searchIcon from '../../../../public/assets/images/메인화면/main_searchIcon.png';
import styles from '@/styles/onBoard.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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

  // 검색어가 있을 경우 검색창에 자동으로 포커스를 부여
  useEffect(() => {
    if (searchTerm.trim()) {
      inputRef.current?.focus();
    }
  }, [searchTerm]);

  /**
   * 검색 버튼 클릭 핸들러
   * 유효한 검색어가 있을 경우 Travel 페이지로 이동
   */
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    router.push(`/Travel?keyword=${encodeURIComponent(searchTerm.trim())}`);
  };

  /**
   * 검색어 입력 변경 핸들러
   * 특수문자를 제외한 한글, 영문, 숫자만 허용
   * @param event 입력 이벤트 객체
   */
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9 ]*$/;

    if (regex.test(input)) {
      setSearchTerm(input);
    } else {
      setAlertMessage(
        '특수문자는 사용할 수 없습니다. 다른 검색어를 입력해 주세요.'
      );
      setAlertSeverity('warning');
      setAlertOpen(true);
    }
  };

  /**
   * 키보드 입력 핸들러
   * Enter 키 입력 시 검색 수행
   * @param event 키보드 이벤트 객체
   */
  const handleSearchKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* 검색 입력 필드 및 버튼 */}
      <div className={styles.onBoardingSearch}>
        <input
          ref={inputRef}
          type='text'
          placeholder='원하는 여행지를 검색해보세요.'
          value={searchTerm}
          onChange={handleSearchInputChange}
          onKeyPress={handleSearchKeyPress}
          className={styles.searchInput}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          <Image
            src={searchIcon}
            alt='돋보기 아이콘'
            width={22}
            height={22}
          />
        </button>
      </div>

      {/* 경고 메시지 Snackbar */}
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
