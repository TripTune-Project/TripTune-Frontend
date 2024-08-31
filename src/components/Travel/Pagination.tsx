import React, { memo } from 'react';
import styles from '../../styles/Pagination.module.css';

interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ total, currentPage, pageSize, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const maxPagesToShow = 5; // 최대 표시할 페이지 수
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
      aria-current={page === currentPage ? 'page' : undefined}
    >
      {page}
    </button>
  );
  
  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);
  const prevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };
  
  // 페이지 버튼 리스트 생성
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className={styles.paginationContainer} role="navigation" aria-label="Pagination Navigation">
      <button
        onClick={goToFirstPage}
        className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
        disabled={currentPage === 1}
        aria-label="First Page"
      >
        &laquo;
      </button>
      <button
        onClick={prevPage}
        className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        &lt;
      </button>
      {pages.map(renderPageButton)}
      {endPage < totalPages && <span className={styles.ellipsis}>...</span>}
      <button
        onClick={nextPage}
        className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        &gt;
      </button>
      <button
        onClick={goToLastPage}
        className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        disabled={currentPage === totalPages}
        aria-label="Last Page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default memo(Pagination);
