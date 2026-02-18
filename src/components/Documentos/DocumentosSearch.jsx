import React from 'react';
import SearchBar from '../Common/SearchBar';

const DocumentosSearch = ({ value, onChange }) => {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Buscar Documento"
      ariaLabel="Buscar Documento por ID, titulo o editorial"
    />
  );
};

export default DocumentosSearch;