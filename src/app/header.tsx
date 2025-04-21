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
import saveLocalContent from '@/utils/saveLocalContent';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [nickName, setNickName] = useState('');

  const { isAuthenticated, isLoading, handleTokenRefresh } = useAuth();
  const { getDecryptedCookie } = saveLocalContent();

  useEffect(() => {
    if (isLoading) return;

    const storedNickname = getDecryptedCookie('nickname');
    if (isAuthenticated && storedNickname) {
      setNickName(storedNickname);
    } else {
      setNickName('');
    }
  }, [isLoading, isAuthenticated, getDecryptedCookie]);

  // 토큰 갱신 주기 설정
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(
        async () => {
          try {
            await handleTokenRefresh();
          } catch (error) {
            console.error('토큰 갱신 실패:', error);
          }
        },
        4 * 60 * 1000
      ); // 4분마다 토큰 갱신

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, handleTokenRefresh]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    closeModal();
    try {
      await logoutApi();
      setNickName('');
      router.push('/');
    } catch {
      setAlertMessage('로그아웃에 실패했습니다. 다시 시도해 주세요.');
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => setAlertOpen(false);
  const handleLogin = () => {
    router.push(`/Login?next=${encodeURIComponent(pathname)}`);
  };

  const isActive = (path: string) =>
    `${styles.navLink} ${pathname === path ? styles.active : ''} ${styles.homeNavLink}`;

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href='/'>
          <Image
            src={MainLogoImage}
            alt='로고'
            width={184}
            height={58}
            priority
          />
        </Link>
        <nav className={styles.navMenu}>
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

          {isLoading ? (
            <div>로딩 중...</div>
          ) : !isAuthenticated ? (
            <div className={styles.headerLinkLogin} onClick={handleLogin}>
              로그인
              <Image src={LoginIcon} alt='>' width={8} height={8} priority />
            </div>
          ) : (
            <div className={styles.navLogin}>
              {nickName} 님
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
