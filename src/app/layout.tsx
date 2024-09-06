'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './header';
import styles from '../styles/Layout.module.css';
import Image from 'next/image';
import ReactGA from 'react-ga4';
import logoImg from '../../public/white_Logo.png';
import '../styles/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

if (GA4_MEASUREMENT_ID) {
  ReactGA.initialize(GA4_MEASUREMENT_ID);
}

const queryClient = new QueryClient();

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isFindPage = pathname.includes('Find');
  
  return (
    <QueryClientProvider client={queryClient}>
      {isFindPage ? (
        <>{children}</>
      ) : (
        <div className={styles.main}>
          <header className={styles.header}>
            <Header />
          </header>
          <main className={styles.section}>
            {isFindPage ? (
              children
            ) : (
              <div className={styles.content}>{children}</div>
            )}
          </main>
          <footer className={styles.footer}>
            <Image
              className={styles.logoImg}
              src={logoImg}
              alt={'logoImg'}
              priority
            />
            <p className={styles.email}>
              <b>Email</b>: triptunehost@gmail.com
            </p>
            <p className={styles.github}>
              <b>Github</b>: <a href="https://github.com/TripTune-Project">https://github.com/TripTune-Project</a>
            </p>
            <p className={styles.copyright}>
              Copyright © 2024 TripTune. All rights reserved.
            </p>
          </footer>
        </div>
      )}
    </QueryClientProvider>
  );
};

export default Layout;
