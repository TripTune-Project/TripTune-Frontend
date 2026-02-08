'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Header from './header';
import styles from '../styles/Layout.module.css';
import Image from 'next/image';
import ReactGA from 'react-ga4';
import FooterLogoImage from '../../public/assets/images/로고/triptuneLogoWhite.webp';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Google Analytics 측정 ID 환경 변수에서 가져오기
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

/**
 * ClientLayout 컴포넌트 Props 인터페이스
 */
interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * ClientLayout 컴포넌트 - 클라이언트 측 레이아웃 로직 처리
 * 주요 기능:
 * - React Query Provider 설정
 * - Schedule 페이지에 대한 특별 레이아웃 처리
 * - 인증 페이지에 대한 특별 레이아웃 처리 (헤더만 표시, 푸터 숨김)
 * - 페이지 공통 레이아웃 제공 (헤더, 푸터 포함)
 *
 * @param {ClientLayoutProps} props - 레이아웃 프롭스
 * @returns {JSX.Element} 레이아웃 컴포넌트
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  // SSR 안전한 QueryClient 인스턴스 (컴포넌트별 단일 인스턴스)
  const [queryClient] = useState(() => new QueryClient());

  // Google Analytics 초기화 (클라이언트에서만 1회 실행)
  const gaInitialized = useRef(false);
  useEffect(() => {
    if (GA4_MEASUREMENT_ID && !gaInitialized.current) {
      ReactGA.initialize(GA4_MEASUREMENT_ID);
      gaInitialized.current = true;
    }
  }, []);

  // 현재 페이지 경로 가져오기
  const pathname = usePathname();

  // Schedule 페이지인지 확인 (Schedule 페이지는 헤더와 푸터가 없음)
  const isSchedulePage = pathname?.includes('/Schedule/');

  // 인증 관련 페이지인지 확인 (헤더는 있지만 푸터는 없음)
  const isAuthPage = pathname === '/Login' ||
                     pathname === '/Join' ||
                     pathname === '/Find' ||
                     pathname?.startsWith('/Find/') ||
                     pathname === '/MyPage';

  return (
    <QueryClientProvider client={queryClient}>
      {isSchedulePage ? (
        // Schedule 페이지는 헤더와 푸터가 모두 없음
        <>{children}</>
      ) : isAuthPage ? (
        // 인증 페이지는 헤더만 있고 푸터는 없음
        <div className={styles.main}>
          {/* 헤더 영역 */}
          <header className={styles.header}>
            <Header />
          </header>

          {/* 메인 콘텐츠 영역 */}
          <main className={styles.section}>
            <div className={styles.content}>{children}</div>
          </main>
        </div>
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
  );
}
