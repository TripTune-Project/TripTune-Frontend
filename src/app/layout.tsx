'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Head from 'next/head';
import Header from './header';
import styles from '../styles/Layout.module.css';
import Image from 'next/image';
import ReactGA from 'react-ga4';
import logoImg from '../../public/white_Logo.png';
import '../styles/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

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
  
  // Mixed content 에러 발생
  return (
    <html lang='ko' className={notoSansKR.className}>
    <Head>
      <title>TripTune</title>
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      <meta
        name="description"
        content="TripTune은 여행자들을 위한 일정 플랫폼 서비스 입니다."
      />
      <link rel="icon" href="/favicon.ico" />
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
        }}
      />
    </Head>
    <body>
    <QueryClientProvider client={queryClient}>
      {isFindPage ? (
            <>{children}</>
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
                  src={logoImg}
                  alt='logoImg'
                  priority
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
      </body>
    </html>
  );
};

export default Layout;
