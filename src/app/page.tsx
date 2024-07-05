"use client"

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import travelImage from '../../public/assets/travel_planning.png';
import { useRouter } from 'next/navigation';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const Banner = styled.div`
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  text-align: center;
  
  img {
    max-width: 60%;
    height: auto;
    border-radius: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const Home: React.FC = () => {
  const router = useRouter();
  
  const handleLoginClick = () => {
    router.push('/Login');
  };
  
  const handleJoinClick = () => {
    router.push('/Join');
  };
  
  return (
    <AppContainer>
      <Banner>
        <h1>여행 계획 어플리케이션</h1>
        <p>함께 여행 일정을 계획해보세요!</p>
        <Image src={travelImage} alt="Travel planning" />
      </Banner>
      <ButtonContainer>
        <Button onClick={handleLoginClick}>로그인</Button>
        <Button onClick={handleJoinClick}>회원가입</Button>
      </ButtonContainer>
    </AppContainer>
  );
};

export default Home;
