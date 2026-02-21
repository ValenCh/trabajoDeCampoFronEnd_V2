import React from 'react';
import SearchBar from '../Common/SearchBar';

const MemoriaSearch = ({ value, onChange }) => {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Buscar Memoria"
      ariaLabel="Buscar Memoria por año o grupo"
    />
  );
};

export default MemoriaSearch;