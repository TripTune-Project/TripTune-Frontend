'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='ko'>
      <body>
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
          <h1 style={{ fontSize: '5rem', marginBottom: '1rem' }}>500</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Internal Server Error</p>
          <button
            onClick={() => reset()}
            style={{ fontSize: '1.2rem', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
