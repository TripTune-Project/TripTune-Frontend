'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import Cookies from 'js-cookie';
import LogoutModal from "@/components/Logout/LogoutModal";
import { Alert, Snackbar } from "@mui/material";
import { logoutApi } from "@/api/logoutApi";
import Button from '@mui/material/Button';
import {useRouter} from "next/navigation";

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
      router.push("/Home")
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
  
  return (
    <>
      <ul className={styles.header_menu}>
        <li className={styles.header_link}>
          <Link href="/Home" className={styles.header_link_a}>
            홈 화면
          </Link>
        </li>
        <li className={styles.header_link}>
          <Link href="/Travel" className={styles.header_link_a}>
            여행지 탐색
          </Link>
        </li>
        <li className={styles.header_link}>
          <Link href="/Schedule" className={styles.header_link_a}>
            일정 만들기
          </Link>
        </li>
        <li className={styles.header_link}>
          <Link href="/MyPage" className={styles.header_link_a}>
            마이 페이지
          </Link>
        </li>
      </ul>
      <ul className={styles.header_menu}>
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
                <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
                  {alertMessage}
                </Alert>
              </Snackbar>
            </li>
          </>
        ) : (
          <>
            <li className={styles.header_link}>
              <Link href="/Login" className={styles.header_link_a}>
                로그인
              </Link>
            </li>
          </>
        )}
      </ul>
    </>
  );
};

export default Header;
