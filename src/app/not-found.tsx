import Link from 'next/link';
import styles from '@/styles/Layout.module.css';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '5rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Page Not Found</p>
      <Link
        href='/'
        style={{ fontSize: '1.2rem', color: 'blue', textDecoration: 'underline' }}
      >
        Go back to Home
      </Link>
    </div>
  );
}
