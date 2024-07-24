import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import React from 'react';
import styles from "@/styles/onBoard.module.css";

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
          <div className={styles.img_slider_explain}>
            <img className={styles.slider_img} src={image} alt={`Slide ${index}`} style={{width: "100%", height:"100%"}}/>
            <p className={styles.slider_text_p}>광화문</p>
            <p className={styles.slider_text_p_detail}>서울 종로구 효자로 12 국립고궁박물관</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperComponent;
