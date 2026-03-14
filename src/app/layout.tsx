import React from 'react';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import ClientLayout from '@/components/ClientLayout';
import '@/styles/global.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TripTune',
  description: 'TripTune은 여행자들을 위한 일정 플랫폼 서비스 입니다.',
  icons: { icon: '/favicon.ico' },
};

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko' className={notoSansKR.className}>
      <head>
        <link rel='preload' href='/assets/images/메인화면/ocean_title.png' as='image' />
        <link rel='preconnect' href='https://www.triptune.co.kr' />
        <link rel='dns-prefetch' href='https://www.triptune.co.kr' />
        <link rel='preconnect' href='https://triptune.s3.ap-northeast-2.amazonaws.com' />
        <link rel='dns-prefetch' href='https://triptune.s3.ap-northeast-2.amazonaws.com' />
      </head>
      <body>
        {GA4_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
              strategy='afterInteractive'
            />
            <Script id='gtag-init' strategy='afterInteractive'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
