import React from 'react';
import Pagination from '../Common/Pagination';

const BecariosPaginacion = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default BecariosPaginacion;