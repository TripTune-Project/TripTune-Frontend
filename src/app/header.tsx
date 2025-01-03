import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import LogoutModal from '@/components/Common/LogoutModal';
import { Alert, Snackbar, Button } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import LoginIcon from '../../public/assets/images/메인화면/main_loginBtn.png';
import MainLogoImage from '../../public/assets/images/로고/triptuneLogo-removebg.png';
import { logoutApi } from '@/apis/Login/logoutApi';
import useAuth from '@/hooks/useAuth';
import Cookies from 'js-cookie';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [, setIsLogoutClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUserNickname = Cookies.get('nickname');
      if (storedUserNickname) {
        setIsLoggedIn(true);
        setUserId(storedUserNickname as string);
      } else {
        setIsLoggedIn(false);
        setUserId('');
      }
      setIsAuthChecked(true);
    };

    checkLoginStatus();

    const intervalId = setInterval(
      () => {
        checkAuthStatus().catch(() => {
          setIsLoggedIn(false);
          setUserId('');
          Cookies.remove('trip-tune_at');
          Cookies.remove('trip-tune_rt');
          Cookies.remove('nickname');
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          router.push('/Login');
        });
      },
      5 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, [checkAuthStatus, router]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    setIsLogoutClicked(true);
    closeModal();
    await performLogout();
  };

  const performLogout = async () => {
    try {
      await logoutApi();
      setIsLoggedIn(false);
      setUserId('');
      router.push('/');
    } catch (error) {
      setAlertMessage('로그아웃에 실패했습니다. 다시 시도해 주세요.');
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => setAlertOpen(false);

  const handleLogin = () => {
    router.push(`/Login?next=${encodeURIComponent(pathname)}`);
  };

  const isActive = (path: string) =>
    `${styles.navLink} ${pathname === path ? styles.active : ''} ${
      pathname === '/' ? styles.homeNavLink : styles.otherNavLink
    }`;

  const headerClassName = `${styles.header} ${pathname === '/' ? styles.homeHeader : ''}`;

  return (
    <header className={headerClassName}>
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
          <Link href='/' className={`${styles.navLink} ${isActive('/')}`}>
            홈 화면
          </Link>
          <Link
            href='/Schedule'
            className={`${styles.navLink} ${isActive('/Schedule')}`}
          >
            일정 만들기
          </Link>
          <Link
            href='/Travel'
            className={`${styles.navLink} ${isActive('/Travel')}`}
          >
            여행지 탐색
          </Link>
          <Link
            href='/MyPage'
            className={`${styles.navLink} ${isActive('/MyPage')}`}
          >
            마이 페이지
          </Link>
          {isAuthChecked ? (
            !isLoggedIn ? (
              <div className={styles.headerLinkLogin} onClick={handleLogin}>
                로그인
                <Image src={LoginIcon} alt='>' width={8} height={8} priority />
              </div>
            ) : (
              <div
                className={styles.navLogin}
                style={{ color: pathname === '/' ? 'white' : 'black' }}
              >
                {userId} 님
                <Button onClick={openModal} variant='text' size='large'>
                  로그아웃
                </Button>
                <LogoutModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  onConfirm={handleLogout}
                />
              </div>
            )
          ) : null}
        </nav>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
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
