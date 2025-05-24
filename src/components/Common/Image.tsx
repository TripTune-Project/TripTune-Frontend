import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import styles from '@/styles/Image.module.css';

interface ImageProps extends Omit<NextImageProps, 'alt'> {
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  ...props
}) => {
  return (
    <div className={`${styles.imageWrapper} ${className}`}>
      <NextImage
        src={src}
        alt={alt}
        className={styles.image}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default Image; 