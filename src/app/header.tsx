import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import LogoutModal from '@/components/Logout/LogoutModal';
import { Alert, Snackbar, Button } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import vector from '../../public/assets/icon/Vector.png';
import LogoImage from '../../public/Logo.png';
import saveLocalContent from '@/utils/saveLocalContent';
import { logoutApi } from '@/api/logoutApi';
import { refreshApi } from '@/api/refreshApi';
import useAuth from '@/hooks/useAuth';
import Cookies from 'js-cookie';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setEncryptedCookie } = saveLocalContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [requestQueue, setRequestQueue] = useState<(() => void)[]>([]);

  const { checkAuthStatus } = useAuth();

  const fetchWithRefresh = async (url: string, options: RequestInit) => {
    try {
      const response = await fetch(url, options);
      if (response.status === 401 && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await refreshApi();
          setIsRefreshing(false);
          requestQueue.forEach((cb) => cb());
          setRequestQueue([]);
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
          setIsRefreshing(false);
        }
      } else if (response.status === 401 && isRefreshing) {
        return new Promise((resolve, reject) => {
          setRequestQueue((prevQueue) => [
            ...prevQueue,
            () => fetchWithRefresh(url, options).then(resolve).catch(reject),
          ]);
        });
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const storedUserId = Cookies.get('userId');
    if (storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();

    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [checkAuthStatus, isLogoutClicked]);

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

  const isActive = (path: string) => (pathname === path ? styles.active : '');

  return (
    <>
      <ul className={styles.headerMenu}>
        <li>
          <Link href='/'>
            <Image
              src={LogoImage}
              alt='로고'
              className={styles.logo}
              width={183}
              height={57}
              priority
            />
          </Link>
        </li>
        <li className={`${styles.headerLink} ${isActive('/')}`}>
          <Link href='/' className={styles.headerLinkA}>
            홈 화면
          </Link>
        </li>
        <li className={`${styles.headerLink} ${isActive('/Schedule')}`}>
          <Link href='/Schedule' className={styles.headerLinkA}>
            일정 만들기
          </Link>
        </li>
        <li className={`${styles.headerLink} ${isActive('/Travel')}`}>
          <Link href='/Travel' className={styles.headerLinkA}>
            여행지 탐색
          </Link>
        </li>
        <li className={`${styles.headerLink} ${isActive('/MyPage')}`}>
          <Link href='/MyPage' className={styles.headerLinkA}>
            마이 페이지
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className={styles.headerLink}>{userId} 님</li>
            <li className={styles.headerLink}>
              <Button onClick={openModal} variant='text' size='large'>
                로그아웃
              </Button>
              <LogoutModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleLogout}
              />
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
            </li>
          </>
        ) : (
          <li className={styles.headerLinkLogin} onClick={handleLogin}>
            로그인
            <Image src={vector} alt={'>'} width={16} height={16} priority />
          </li>
        )}
      </ul>
    </>
  );
};

export default Header;
