'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Mypage.module.css';

const Bookmark = () => {
  const bookmarks = [
    {
      placeId: 1,
      placeName: '서울 타워',
      address: '서울특별시 용산구 남산공원길 105',
      description: '서울의 야경을 한눈에 볼 수 있는 대표적인 관광 명소입니다.',
    },
  ];

  const router = useRouter();

  const handleItemClick = (placeId: number) => {
    router.push(`/Travel/${placeId}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>내 북마크</h2>
      {bookmarks.length > 0 ? (
        <ul className={styles.list}>
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.placeId}
              className={styles.item}
              onClick={() => handleItemClick(bookmark.placeId)}
            >
              <div className={styles.itemHeader}>
                <h3 className={styles.placeName}>{bookmark.placeName}</h3>
                <p className={styles.address}>{bookmark.address}</p>
              </div>
              <p className={styles.description}>{bookmark.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>북마크한 여행지가 없습니다.</p>
      )}
    </div>
  );
};

export default Bookmark;
