import React from 'react';

/**
 * GruposPaginacion
 *
 * Botones numéricos de paginación.
 * Solo se renderiza si hay más de una página.
 *
 * Props:
 *  - currentPage: number     → página actual (base 1)
 *  - totalPages: number      → cantidad total de páginas
 *  - onPageChange: function  → recibe el número de página destino
 */
const GruposPaginacion = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="groups-pagination">
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Ir a página ${pageNumber}`}
            aria-current={currentPage === pageNumber ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        );
      })}
    </div>
  );
};

export default GruposPaginacion;