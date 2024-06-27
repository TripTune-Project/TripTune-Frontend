'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import Cookies from 'js-cookie';

const Header = () => {
  const [loginTrue, setLoginTrue] = useState<boolean>(false);
  
  useEffect(() => {
    const accessToken = Cookies.get('trip-tune_at');
    const refreshToken = Cookies.get('trip-tune_rt');
    
    if (accessToken && refreshToken) {
      setLoginTrue(true);
    } else {
      setLoginTrue(false);
    }
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
      </ul>
      <ul className={styles.header_menu}>
        {loginTrue ? (
          <>
            <li className={styles.header_link}>
              <Link href="/BookMark" className={styles.header_link_a}>
                북마크
              </Link>
            </li>
            <li className={styles.header_link}>
              <Link href="/MyPage" className={styles.header_link_a}>
                마이페이지
              </Link>
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
