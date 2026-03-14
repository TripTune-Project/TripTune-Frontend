import React from 'react';
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import ClientLayout from '@/components/ClientLayout';
import '@/styles/global.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
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
