import React from 'react';
import Pagination from '../Common/Pagination';

const IntegrantesCEPaginacion = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default IntegrantesCEPaginacion;