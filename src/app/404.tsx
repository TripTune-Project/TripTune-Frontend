import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Error.module.css';

export default function Custom404() {
  return (
    <div className={styles.container}>
      <Head>
        <title>404 - Page Not Found | Your Website Name</title>
        <meta
          name='description'
          content='The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
        />
        <meta name='robots' content='noindex, follow' />
        <meta property='og:title' content='404 - Page Not Found' />
        <meta
          property='og:description'
          content='The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
        />
        <meta property='og:image' content='/assets/Logo.png' />
        <meta property='og:url' content='https://triptune.netlify.app/404' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.errorMessage}>Page Not Found</p>
      <Link href='/'>
        <a className={styles.homeLink}>Go back to Home</a>
      </Link>
    </div>
  );
}
