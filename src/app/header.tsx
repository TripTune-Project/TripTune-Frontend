'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Header.module.css';
import LogoutModal from '@/components/Common/LogoutModal';
import { Alert, Snackbar, Button } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import LoginIcon from '../../public/assets/images/메인화면/main_loginBtn.png';
import MainLogoImage from '../../public/assets/images/로고/triptuneLogo-removebg.png';
import { logoutApi } from '@/apis/Login/logoutApi';
import useAuth from '@/hooks/useAuth';

/**
 * Header 컴포넌트 - 앱 상단 헤더 및 네비게이션 바 구현
 * 주요 기능:
 * - 네비게이션 메뉴 제공 (홈, A일정 만들기, 여행지 탐색, 마이페이지)
 * - 로그인/로그아웃 기능 제공
 * - 현재 페이지 표시 (활성 메뉴)
 * - 토큰 자동 갱신 기능
 */
const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  // 모달 및 알림 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 인증 관련 커스텀 훅 사용
  const {
    isAuthenticated,
    isLoading,
    handleTokenRefresh,
    updateAuthStatus,
    nickname,
  } = useAuth();

  /**
   * 토큰 갱신 주기 설정 (4분마다 토큰 갱신)
   * 인증된 사용자에 대해서만 실행
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      async () => {
        try {
          await handleTokenRefresh();
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
        }
      },
      4 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [isAuthenticated, handleTokenRefresh]);

  // 모달 제어 함수
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  /**
   * 로그아웃 처리 함수
   * 로그아웃 API 호출 후 인증 상태 업데이트 및 홈으로 이동
   */
  const handleLogout = async () => {
    closeModal();
    try {
      await logoutApi();
      updateAuthStatus(false);
      router.push('/');
    } catch {
      setAlertMessage('로그아웃에 실패했습니다. 다시 시도해 주세요.');
      setAlertOpen(true);
    }
  };

  // 알림창 닫기 핸들러
  const handleAlertClose = () => setAlertOpen(false);

  /**
   * 로그인 페이지로 이동 핸들러
   * 현재 페이지 경로를 next 파라미터로 전달하여 로그인 후 복귀할 수 있도록 함
   */
  const handleLogin = () => {
    router.push(`/Login?next=${encodeURIComponent(pathname as string)}`);
  };

  /**
   * 현재 활성화된 메뉴 스타일 적용 함수
   * @param path 현재 경로
   * @returns 스타일 클래스명
   */
  const isActive = (path: string) =>
    `${styles.navLink} ${pathname === path ? styles.active : ''} ${styles.homeNavLink}`;

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* 로고 및 홈 링크 */}
        <Link href='/'>
          <Image
            src={MainLogoImage}
            alt='로고'
            width={184}
            height={58}
            priority
          />
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className={styles.navMenu} style={{ marginLeft: 'auto' }}>
          <Link href='/' className={isActive('/')}>
            홈 화면
          </Link>
          <Link href='/Schedule' className={isActive('/Schedule')}>
            일정 만들기
          </Link>
          <Link href='/Travel' className={isActive('/Travel')}>
            여행지 탐색
          </Link>
          <Link href='/MyPage' className={isActive('/MyPage')}>
            마이 페이지
          </Link>

          {/* 로그인/로그아웃 상태 표시 */}
          {isLoading ? (
            <div>로딩 중...</div>
          ) : !isAuthenticated || !nickname ? (
            // 비로그인 상태 또는 닉네임이 없는 경우: 로그인 버튼 표시
            <div className={styles.headerLinkLogin} onClick={handleLogin}>
              로그인
              <Image src={LoginIcon} alt='>' width={8} height={8} priority />
            </div>
          ) : (
            // 로그인 상태이고 닉네임이 있는 경우: 사용자 이름과 로그아웃 버튼 표시
            <div className={styles.navLogin}>
              {nickname} 님
              <Button onClick={openModal} variant='text' size='large'>
                로그아웃
              </Button>
              <LogoutModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleLogout}
              />
            </div>
          )}
        </nav>
      </div>

      {/* 알림 메시지 Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity='error'
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </header>
  );
};

export default Header;
