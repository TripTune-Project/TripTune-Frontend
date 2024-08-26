import React from 'react';

interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            margin: '0 5px',
            backgroundColor: page === currentPage ? '#ddd' : '#fff',
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
