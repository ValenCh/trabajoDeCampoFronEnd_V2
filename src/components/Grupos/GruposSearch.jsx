import React from 'react';
import SearchBar from '../Common/SearchBar';

/**
 * GruposSearch
 *
 * Wrapper específico de búsqueda para la página de Grupos.
 * Usa el componente SearchBar genérico con configuración específica.
 *
 * Props:
 *  - value: string       → valor actual del input (estado controlado)
 *  - onChange: function  → recibe el nuevo string al escribir
 */
const GruposSearch = ({ value, onChange }) => {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Buscar Grupo"
      ariaLabel="Buscar grupo por número o nombre"
    />
  );
};

export default GruposSearch;