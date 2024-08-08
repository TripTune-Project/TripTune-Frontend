import Link from 'next/link';
import styles from '../styles/Error.module.css';

export default function Custom500() {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>500</h1>
      <p className={styles.errorMessage}>Internal Server Error</p>
      <Link href="/">
        <a className={styles.homeLink}>Go back to Home</a>
      </Link>
    </div>
  );
}
