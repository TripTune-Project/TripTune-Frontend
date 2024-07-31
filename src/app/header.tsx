'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import Cookies from 'js-cookie';
import LogoutModal from "@/components/Logout/LogoutModal";
import { Alert, Snackbar } from "@mui/material";
import { logoutApi } from "@/api/logoutApi";
import Button from '@mui/material/Button';
import { useRouter } from "next/navigation";
import vector from "../../public/assets/icon/Vector.png";
import Image from 'next/image';

const Header = () => {
  const router = useRouter();
  const userId = Cookies.get('userId');
  const [loginTrue, setLoginTrue] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleLogout = async () => {
    closeModal();
    try {
      await logoutApi();
      router.push("/")
    } catch (error) {
      setAlertMessage('로그아웃에 실패했습니다. 다시 시도해 주세요.');
      setAlertOpen(true);
    }
  };
  
  const handleAlertClose = () => setAlertOpen(false);
  
  const checkAuthStatus = () => {
    const accessToken = Cookies.get('trip-tune_at');
    const refreshToken = Cookies.get('trip-tune_rt');
    
    if (accessToken && refreshToken) {
      setLoginTrue(true);
    } else {
      setLoginTrue(false);
    }
  };
  
  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleLogin = () => {
    router.push('/Login');
  }
  
  return (
    <>
      <ul className={styles.header_menu}>
        <li className={styles.header_link}>
          <Link href="/" className={styles.header_link_a}>
            홈 화면
          </Link>
        </li>
        <li className={styles.header_link}>
          <Link href="/Schedule" className={styles.header_link_a}>
            일정 만들기
          </Link>
        </li>
        <li className={styles.header_link}>
          <Link href="/Travel" className={styles.header_link_a}>
            여행지 탐색
          </Link>
        </li>
        <li className={styles.header_link}>
          <Link href="/MyPage" className={styles.header_link_a}>
            마이 페이지
          </Link>
        </li>
        {loginTrue ? (
          <>
            <li className={styles.header_link}>
              {userId} 님
            </li>
            <li className={styles.header_link}>
              <Button onClick={openModal} variant="text" size="large">로그아웃</Button>
              <LogoutModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleLogout}
              />
              <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="error" sx={{width: '100%'}}>
                  {alertMessage}
                </Alert>
              </Snackbar>
            </li>
          </>
        ) : (
          <div className={styles.header_link_login} onClick={handleLogin}>
            로그인
            <Image src={vector} alt={">"} width={16} height={16} />
          </div>
        )}
      </ul>
    </>
  );
};

export default Header;
