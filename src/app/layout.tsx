import React from 'react';
import Head from 'next/head';
import Header from './header';
import styles from '../styles/Layout.module.css';
import Image from 'next/image';
import LogoImage from '../../public/Logo.png';
import Link from 'next/link';
import ReactGA from 'react-ga4';

ReactGA.initialize('YOUR_GA4_MEASUREMENT_ID');

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="ko">
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_MEASUREMENT_ID`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'YOUR_GA4_MEASUREMENT_ID', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <title>TripTune</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <div className={styles.main}>
          <header className={styles.header}>
            <Link href="/Home" className={styles.logo_link}>
              <Image
                src={LogoImage}
                alt="로고"
                width={200}
                height={200}
                className={styles.logoImage}
              />
            </Link>
            <Header />
          </header>
          <main className={styles.section}>
            <div className={styles.content}>{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
