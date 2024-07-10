import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import React from 'react';

interface SwiperComponentProps {
  images: string[]; // 이미지 URL 배열
}

const SwiperComponent: React.FC<SwiperComponentProps> = ({ images }) => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} alt={`Slide ${index}`} style={{ width: "100%" }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperComponent;
