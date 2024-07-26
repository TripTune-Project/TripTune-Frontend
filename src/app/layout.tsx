'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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
	const pathname = usePathname();
	const isFindPage = pathname.includes('Find');
	
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
			<link rel="icon" href="/favicon.ico"/>
		</Head>
		<body>
		{isFindPage ? (
			<div>{children}</div>
		) : (
			<div className={styles.main}>
				<header className={styles.header}>
					<Image src={LogoImage} alt="로고" className={styles.header_left}/>
					<Header/>
				</header>
				<main className={styles.section}>
					{isFindPage ? children : <div className={styles.content}>{children}</div>}
				</main>
				<footer className={styles.footer}>
					<Image className={styles.logoImg} src={LogoImage} alt="로고"/>
					<p className={styles.email}>Email: triptunehost@gmail.com</p>
					<p className={styles.github}>Github: https://github.com/TripTune-Project</p>
					<p className={styles.copyright}>Copyright © 2024 TripTune. All rights reserved.</p>
				</footer>
			</div>
		)}
		</body>
		</html>
	);
};

export default Layout;
