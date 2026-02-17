import React from 'react';
import Pagination from '../Common/Pagination';

/**
 * GruposPaginacion
 *
 * Wrapper específico de paginación para la página de Grupos.
 * Usa el componente Pagination genérico con configuración específica.
 *
 * Props:
 *  - currentPage: number     → página actual (base 1)
 *  - totalPages: number      → cantidad total de páginas
 *  - onPageChange: function  → recibe el número de página destino
 */
const GruposPaginacion = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default GruposPaginacion;