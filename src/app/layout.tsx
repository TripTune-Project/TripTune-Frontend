import React from 'react';
import Script from 'next/script';
import { Noto_Sans_KR } from 'next/font/google';
import '@/styles/global.css';
import ClientLayout from './ClientLayout';

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

/**
 * Metadata 설정
 */
export const metadata = {
  title: 'TripTune - 여행 계획 플랫폼',
  description: 'TripTune은 여행자들을 위한 일정 플랫폼 서비스 입니다.',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'Content-Security-Policy': 'upgrade-insecure-requests',
  },
};

/**
 * Layout 컴포넌트 Props 인터페이스
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout 컴포넌트 - 앱 전체 레이아웃을 제공 (Server Component)
 * 주요 기능:
 * - 페이지 공통 레이아웃 제공 (HTML 구조)
 * - Google Analytics 통합
 * - 기본 메타 태그 및 SEO 설정
 *
 * @param {LayoutProps} props - 레이아웃 프롭스
 * @returns {JSX.Element} 레이아웃 컴포넌트
 */
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang='ko' className={notoSansKR.className}>
      <body>
        {/* Google Analytics 스크립트 - 초기 로딩 블로킹 방지 */}
        {GA4_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
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
          </>
        )}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
