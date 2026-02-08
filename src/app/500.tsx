import Link from 'next/link';
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
      <ErrorCode>500</ErrorCode>
      <ErrorMessage>Internal Server Error</ErrorMessage>
      <Link href='/' passHref>
        <HomeLink>Go back to Home</HomeLink>
      </Link>
    </Container>
  );
}
