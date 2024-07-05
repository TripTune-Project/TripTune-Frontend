'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import travelImage from '../../public/assets/travel_planning.png';
import styles from '../styles/onBoard.module.css';

const Home: React.FC = () => {
  const router = useRouter();
  
  const handleLoginClick = () => {
    router.push('/Login');
  };
  
  const handleJoinClick = () => {
    router.push('/Join');
  };
  
  return (
    <div className={styles.appContainer}>
      <div className={styles.banner}>
        <h1>여행 계획 어플리케이션</h1>
        <p>함께 여행 일정을 계획해보세요!</p>
        <Image src={travelImage} alt="Travel planning" />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleLoginClick}>
          로그인
        </button>
        <button className={styles.button} onClick={handleJoinClick}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Home;
