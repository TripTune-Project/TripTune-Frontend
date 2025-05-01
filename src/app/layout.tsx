'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Head from 'next/head';
import Header from './header';
import styles from '@/styles/Layout.module.css';
import Image from 'next/image';
import ReactGA from 'react-ga4';
import FooterLogoImage from '../../public/assets/images/로고/triptuneLogoWhite.png';
import '@/styles/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Noto_Sans_KR } from 'next/font/google';

/**
 * Noto Sans KR 폰트 설정
 * 전체 애플리케이션에 적용될 기본 폰트
 */
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

// Google Analytics 측정 ID 환경 변수에서 가져오기
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

// Google Analytics 초기화 (ID가 있는 경우에만 실행)
if (GA4_MEASUREMENT_ID) {
  ReactGA.initialize(GA4_MEASUREMENT_ID);
}

// React Query 클라이언트 인스턴스 생성
const queryClient = new QueryClient();

/**
 * Layout 컴포넌트 Props 인터페이스
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout 컴포넌트 - 앱 전체 레이아웃을 제공
 * 주요 기능:
 * - 페이지 공통 레이아웃 제공 (헤더, 푸터 포함)
 * - Google Analytics 통합
 * - 기본 메타 태그 및 SEO 설정
 * - React Query Provider 설정
 * - Schedule 페이지에 대한 특별 레이아웃 처리
 *
 * @param {LayoutProps} props - 레이아웃 프롭스
 * @returns {JSX.Element} 레이아웃 컴포넌트
 */
const Layout = ({ children }: LayoutProps) => {
  // 현재 페이지 경로 가져오기
  const pathname = usePathname();
  // Schedule 페이지인지 확인 (Schedule 페이지는 헤더와 푸터가 없음)
  const isSchedulePage = pathname?.includes('/Schedule/');

  return (
    <html lang='ko' className={notoSansKR.className}>
      {/* 페이지 헤드 및 메타 태그 설정 */}
      <Head>
        <title>TripTune</title>
        <meta
          http-equiv='Content-Security-Policy'
          content='upgrade-insecure-requests'
        />
        <meta
          name='description'
          content='TripTune은 여행자들을 위한 일정 플랫폼 서비스 입니다.'
        />
        <link rel='icon' href='/favicon.ico' />

        {/* Google Analytics 스크립트 */}
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
        {/* React Query Provider 래핑 */}
        <QueryClientProvider client={queryClient}>
          {isSchedulePage ? (
            // Schedule 페이지는 특별한 레이아웃 필요 없음
            <>{children}</>
          ) : (
            // 일반 페이지 레이아웃 (헤더, 메인 콘텐츠, 푸터 포함)
            <div className={styles.main}>
              {/* 헤더 영역 */}
              <header className={styles.header}>
                <Header />
              </header>

              {/* 메인 콘텐츠 영역 */}
              <main className={styles.section}>
                <div className={styles.content}>{children}</div>
              </main>

              {/* 푸터 영역 */}
              <footer className={styles.footer}>
                <Image
                  className={styles.logoImg}
                  src={FooterLogoImage}
                  alt='FooterLogoImage'
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
