'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Head from 'next/head';
import Header from './header';
import styles from '../styles/Layout.module.css';
import Image from 'next/image';
import ReactGA from 'react-ga4';
import logoImg from "../../public/white_Logo.png";
import "../styles/global.css";

ReactGA.initialize('YOUR_GA4_MEASUREMENT_ID');

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const pathname = usePathname();
	const isFindPage = pathname.includes('Find');
	
	return (
		<html>
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
			<>{children}</>
		) : (
			<div className={styles.main}>
				<header className={styles.header}>
					<Header/>
				</header>
				<main className={styles.section}>
					{isFindPage ? children : <div className={styles.content}>{children}</div>}
				</main>
				<footer className={styles.footer}>
					<Image className={styles.logoImg} src={logoImg} alt={"logoImg"}/>
					<p className={styles.email}><b>Email</b>: triptunehost@gmail.com</p>
					<p className={styles.github}><b>Github</b>: https://github.com/TripTune-Project</p>
					<p className={styles.copyright}>Copyright © 2024 TripTune. All rights reserved.</p>
				</footer>
			</div>
		)}
		</body>
		</html>
	);
};

export default Layout;
