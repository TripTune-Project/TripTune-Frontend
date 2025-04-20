import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 5rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const HomeLink = styled.a`
  font-size: 1.2rem;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;

export default function Custom500() {
  return (
    <Container>
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
        <meta property='og:url' content='https://www.triptune.site/500' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <ErrorCode>500</ErrorCode>
      <ErrorMessage>Internal Server Error</ErrorMessage>
      <Link href='/' passHref>
        <HomeLink>Go back to Home</HomeLink>
      </Link>
    </Container>
  );
}
