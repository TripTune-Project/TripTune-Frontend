'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styles from '@/styles/Layout.module.css';
import FooterLogoImage from '../../public/assets/images/로고/triptuneLogoWhite.png';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  const isSchedulePage = pathname?.includes('/Schedule/');
  const isAuthPage =
    pathname === '/Login' ||
    pathname === '/Join' ||
    pathname === '/Find' ||
    pathname?.startsWith('/Find/') ||
    pathname === '/MyPage';
  // 여행지 탐색은 일정 페이지처럼 푸터 없이 지도가 화면을 채운다 (7/12 회의)
  const hideFooter = isAuthPage || pathname === '/Travel';

  return (
    <QueryClientProvider client={queryClient}>
      {isSchedulePage ? (
        <>{children}</>
      ) : hideFooter ? (
        <div className={styles.main}>
          <header className={styles.header}>
            <Header />
          </header>
          <main className={styles.section}>
            <div className={styles.content}>{children}</div>
          </main>
        </div>
      ) : (
        <div className={styles.main}>
          <header className={styles.header}>
            <Header />
          </header>
          <main className={styles.section}>
            <div className={styles.content}>{children}</div>
          </main>
          <footer className={styles.footer}>
            <Image
              className={styles.logoImg}
              src={FooterLogoImage}
              alt='FooterLogoImage'
              loading='lazy'
            />
            <p className={styles.email}>
              <b>Email</b>: triptunehost@gmail.com
            </p>
            <p className={styles.github}>
              <b>Github</b>:{' '}
              <a href='https://github.com/TripTune-Project'>
                https://github.com/TripTune-Project
              </a>
            </p>
            <p className={styles.copyright}>
              Copyright © 2024 TripTune. All rights reserved.
            </p>
          </footer>
        </div>
      )}
    </QueryClientProvider>
  );
}
