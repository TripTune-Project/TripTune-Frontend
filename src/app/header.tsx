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
import saveLocalContent from '@/utils/saveLocalContent';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [nickName, setNickName] = useState<string>('');
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const { getDecryptedCookie } = saveLocalContent();
  
  useEffect(() => {
    setIsAuthChecked(false);
    const refreshToken = getDecryptedCookie('trip-tune_rt');
    if (refreshToken && isAuthenticated) {
      const storedUserNickname = getDecryptedCookie('nickname');
      setIsLoggedIn(true);
      setNickName(storedUserNickname as string);
    } else {
      setIsLoggedIn(false);
      setNickName('');
    }
    setIsAuthChecked(true);
  }, [isAuthenticated, router]);
  
  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);
  
  const handleLogout = async (): Promise<void> => {
    closeModal();
    await performLogout();
  };
  
  const performLogout = async (): Promise<void> => {
    try {
      await logoutApi();
      setIsLoggedIn(false);
      setNickName('');
      router.push('/');
    } catch (error) {
      setAlertMessage('로그아웃에 실패했습니다. 다시 시도해 주세요.');
      setAlertOpen(true);
    }
  };
  
  const handleAlertClose = (): void => setAlertOpen(false);
  const handleLogin = (): void => {
    router.push(`/Login?next=${encodeURIComponent(pathname)}`);
  };
  
  const isActive = (path: string): string =>
    `${styles.navLink} ${pathname === path ? styles.active : ''} ${
      pathname === '/' ? styles.homeNavLink : styles.otherNavLink
    }`;
  
  const headerClassName = `${styles.header} ${pathname === '/' ? styles.homeHeader : ''}`;
  
  return (
    <header className={headerClassName}>
      <div className={styles.headerContent}>
        <Link href="/">
          <Image
            src={MainLogoImage}
            alt="로고"
            width={184}
            height={58}
            priority
          />
        </Link>
        <nav className={styles.navMenu}>
          <Link href="/" className={`${styles.navLink} ${isActive('/')}`}>
            홈 화면
          </Link>
          <Link href="/Schedule" className={`${styles.navLink} ${isActive('/Schedule')}`}>
            일정 만들기
          </Link>
          <Link href="/Travel" className={`${styles.navLink} ${isActive('/Travel')}`}>
            여행지 탐색
          </Link>
          <Link href="/MyPage" className={`${styles.navLink} ${isActive('/MyPage')}`}>
            마이 페이지
          </Link>
          {isAuthChecked ? (
            !isLoggedIn ? (
              <div className={styles.headerLinkLogin} onClick={handleLogin}>
                로그인
                <Image src={LoginIcon} alt=">" width={8} height={8} priority />
              </div>
            ) : (
              <div
                className={styles.navLogin}
                style={{ color: pathname === '/' ? 'white' : 'black' }}
              >
                {nickName} 님
                <Button onClick={openModal} variant="text" size="large">
                  로그아웃
                </Button>
                <LogoutModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  onConfirm={handleLogout}
                />
              </div>
            )
          ) : (
            <div>로딩 중...</div>
          )}
        </nav>
      </div>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </header>
  );
};

export default Header;
