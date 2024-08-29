import React, { memo } from 'react';

interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ total, currentPage, pageSize, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  
  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      style={{
        margin: '0 5px',
        backgroundColor: page === currentPage ? '#ddd' : '#fff',
      }}
      aria-current={page === currentPage ? 'page' : undefined}
    >
      {page}
    </button>
  );
  
  return (
    <div role="navigation" aria-label="Pagination Navigation">
      {pages.map(renderPageButton)}
    </div>
  );
};

export default memo(Pagination);
