import React from 'react';
import './Pagination.css';

/**
 * Pagination - Componente de paginación reutilizable
 *
 * Props:
 *  - currentPage: number         → página actual (base 1)
 *  - totalPages: number          → cantidad total de páginas
 *  - onPageChange: function      → recibe el número de página destino
 *  - maxVisible: number          → máximo de botones visibles (default: 7)
 *  - showFirstLast: boolean      → mostrar botones Primera/Última (default: false)
 *  - showPrevNext: boolean       → mostrar botones Anterior/Siguiente (default: true)
 *  - disabled: boolean           → deshabilitar todos los botones
 *  - className: string           → clase adicional para el wrapper
 *  - buttonClassName: string     → clase adicional para los botones
 *  - size: 'small' | 'medium' | 'large' → tamaño de los botones (default: 'medium')
 *
 * Ejemplo de uso:
 *
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 * />
 *
 * Con navegación completa:
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 *   showFirstLast
 *   maxVisible={5}
 * />
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisible = 7,
  showFirstLast = false,
  showPrevNext = true,
  disabled = false,
  className = '',
  buttonClassName = '',
  size = 'medium',
}) => {
  // No renderizar si solo hay una página o menos
  if (totalPages <= 1) return null;

  // Calcular rango de páginas visibles
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calcular inicio y fin del rango
      const halfVisible = Math.floor(maxVisible / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      
      // Ajustar si estamos cerca del final
      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      // Añadir primera página y puntos suspensivos si es necesario
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('ellipsis-start');
        }
      }
      
      // Añadir páginas del rango
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Añadir puntos suspensivos y última página si es necesario
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsis-end');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page) => {
    if (page === currentPage || disabled) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !disabled && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1 && !disabled && onPageChange) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages && !disabled && onPageChange) {
      onPageChange(totalPages);
    }
  };

  const pageNumbers = getPageNumbers();
  const sizeClass = `pagination-${size}`;

  return (
    <div className={`pagination-wrapper ${sizeClass} ${className}`.trim()}>
      {/* Botón Primera */}
      {showFirstLast && (
        <button
          className={`pagination-btn pagination-nav ${buttonClassName}`.trim()}
          onClick={handleFirst}
          disabled={disabled || currentPage === 1}
          aria-label="Primera página"
          title="Primera página"
        >
          <i className="fa-solid fa-angles-left" />
        </button>
      )}

      {/* Botón Anterior */}
      {showPrevNext && (
        <button
          className={`pagination-btn pagination-nav ${buttonClassName}`.trim()}
          onClick={handlePrevious}
          disabled={disabled || currentPage === 1}
          aria-label="Página anterior"
          title="Página anterior"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>
      )}

      {/* Números de página */}
      {pageNumbers.map((page, index) => {
        if (typeof page === 'string') {
          // Puntos suspensivos
          return (
            <span
              key={page}
              className="pagination-ellipsis"
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            className={`pagination-btn ${
              currentPage === page ? 'active' : ''
            } ${buttonClassName}`.trim()}
            onClick={() => handlePageClick(page)}
            disabled={disabled}
            aria-label={`Ir a página ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Botón Siguiente */}
      {showPrevNext && (
        <button
          className={`pagination-btn pagination-nav ${buttonClassName}`.trim()}
          onClick={handleNext}
          disabled={disabled || currentPage === totalPages}
          aria-label="Página siguiente"
          title="Página siguiente"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      )}

      {/* Botón Última */}
      {showFirstLast && (
        <button
          className={`pagination-btn pagination-nav ${buttonClassName}`.trim()}
          onClick={handleLast}
          disabled={disabled || currentPage === totalPages}
          aria-label="Última página"
          title="Última página"
        >
          <i className="fa-solid fa-angles-right" />
        </button>
      )}
    </div>
  );
};

export default Pagination;