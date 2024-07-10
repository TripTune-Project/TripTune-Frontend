"use client";

import SwiperComponent from '../../components/Home/index';
import React from "react";

const Home: React.FC = () => {
  const images = [
    'https://picsum.photos/seed/picsum/1000/300',
    'https://picsum.photos/seed/picsum/1000/301',
    'https://picsum.photos/seed/picsum/1000/302',
    'https://picsum.photos/seed/picsum/1000/303',
    'https://picsum.photos/seed/picsum/1000/304',
  ];
  
  return (
    <div>
      메인 페이지 - 홈
      <SwiperComponent images={images} />
    </div>
  );
};

export default Home;
