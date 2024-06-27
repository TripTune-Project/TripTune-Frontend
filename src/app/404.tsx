import Link from 'next/link';
import styles from './ErrorPage.module.css';

export default function Custom404() {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.errorMessage}>Page Not Found</p>
      <Link href="/">
        <a className={styles.homeLink}>Go back to Home</a>
      </Link>
    </div>
  );
}
