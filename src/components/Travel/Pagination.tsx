import React from 'react';
import styles from '../../styles/Travel.module.css';

interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ total, currentPage, pageSize, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const maxPagesToShow = 5;
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
  
  const renderNavButton = (onClick: () => void, disabled: boolean, symbol: string, ariaLabel: string) => (
    <button
      onClick={onClick}
      className={`${styles.navButton} ${disabled ? styles.disabled : ''}`}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {symbol}
    </button>
  );
  
  const generatePageButtons = () => {
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(renderPageButton(i));
    }
    return pages;
  };
  
  return (
    <div className={styles.paginationContainer} role="navigation" aria-label="Pagination Navigation">
      {renderNavButton(() => onPageChange(1), currentPage === 1, '«', 'First Page')}
      {renderNavButton(() => onPageChange(currentPage - 1), currentPage === 1, '‹', 'Previous Page')}
      {generatePageButtons()}
      {endPage < totalPages && <span className={styles.ellipsis}>...</span>}
      {renderNavButton(() => onPageChange(currentPage + 1), currentPage === totalPages, '›', 'Next Page')}
      {renderNavButton(() => onPageChange(totalPages), currentPage === totalPages, '»', 'Last Page')}
    </div>
  );
};

export default Pagination;
