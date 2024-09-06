import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Error.module.css';

export default function Custom500() {
  return (
    <div className={styles.container}>
      <Head>
        <title>500 - Internal Server Error | Your Website Name</title>
        <meta
          name='description'
          content='An internal server error occurred. Please try again later or contact support.'
        />
        <meta name='robots' content='noindex, follow' />
        <meta property='og:title' content='500 - Internal Server Error' />
        <meta
          property='og:description'
          content='An internal server error occurred. Please try again later or contact support.'
        />
        <meta property='og:image' content='/assets/Logo.png' />
        <meta property='og:url' content='https://triptune.netlify.app/500' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <h1 className={styles.errorCode}>500</h1>
      <p className={styles.errorMessage}>Internal Server Error</p>
      <Link href='/'>
        <a className={styles.homeLink}>Go back to Home</a>
      </Link>
    </div>
  );
}
