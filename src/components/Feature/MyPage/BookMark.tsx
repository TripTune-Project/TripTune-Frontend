import React, { useState } from 'react';
import Pagination from '@/components/Common/Pagination';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMyPageBookMarkList } from '@/hooks/useMyPage';
import { useMyPageBookMarkStore } from '@/store/myPageBookMarkStore';
import NoResultLayout from '@/components/Common/NoResult';
import locationIcon from '../../../../public/assets/images/여행지 탐색/홈화면/placeHome_mapIcon.png';
import styles from '@/styles/Mypage.module.css';
import DataLoading from '@/components/Common/DataLoading';
import { BookmarkPlace } from '@/types/myPage';
import { truncateText } from '@/utils';

const BookMark = () => {
  const router = useRouter();
  const { currentPage, setCurrentPage } = useMyPageBookMarkStore();

  const [sort, setSort] = useState<'newest' | 'oldest' | 'name'>('newest');
  const { data: myPageBookMarkData, isLoading } = useMyPageBookMarkList(
    currentPage,
    sort
  );

  const handleDetailClick = (placeId: number) => {
    router.push(`/Travel/${placeId}`);
  };

  if (isLoading) {
    return <DataLoading />;
  }

  const places: BookmarkPlace[] = myPageBookMarkData?.data?.content || [];
  const totalPages = myPageBookMarkData?.data?.totalPages ?? 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as 'newest' | 'oldest' | 'name');
    setCurrentPage(1);
  };

  return (
    <div className={styles.listContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.leftHeader}>
          <div className={styles.mypageTitle}
          style={{marginLeft:"200px", marginTop:"36px"}}
          >북마크</div>
          <div className={styles.totalCount}>
            전체
            <span className={styles.circleCount} >
              {places.length}
            </span>
          </div>
        </div>
        <div className={styles.rightHeader}>
          <select
            className={styles.orderSelect}
            value={sort}
            onChange={handleSortChange}
          >
            <option value='newest'>최신순</option>
            <option value='oldest'>오래된 순</option>
            <option value='name'>이름 순</option>
          </select>
        </div>
      </div>

      <div className={styles.bookmarkGrid}>
        {places && places.length > 0 ? (
          places.map((place) => (
            <div
              key={place.placeId}
              className={styles.bookmarkCard}
              onClick={() => handleDetailClick(place.placeId)}
            >
              <div className={styles.imageContainer}>
                {place.thumbnailUrl ? (
                  <Image
                    src={place.thumbnailUrl}
                    alt={place.placeName}
                    width={95}
                    height={95}
                    className={styles.thumbnailImage}
                    priority
                  />
                ) : (
                  <div className={styles.noImage}>이미지 없음</div>
                )}
              </div>
              <div className={styles.placeInfo}>
                <div className={styles.placeName}>
                  {` ${truncateText(`${place.placeName}`, 10)}`}
                </div>
                <p className={styles.placeDetailAddress}>
                  <Image src={locationIcon} alt='장소' width={15} height={21} />
                  {` ${truncateText(`${place.address} ${place.detailAddress ?? ''}`, 16)}`}
                </p>
              </div>
            </div>
          ))
        ) : (
          <NoResultLayout />
        )}
      </div>

      {places && places.length > 0 && totalPages > 0 && (
        <Pagination
          total={totalPages * 5}
          currentPage={currentPage}
          pageSize={5}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BookMark;
