import React from 'react';
import Pagination from '../Common/Pagination';

const MemoriasPaginacion = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      showFirstLast
      showPrevNext
      maxVisible={7}
    />
  );
};

export default MemoriasPaginacion;