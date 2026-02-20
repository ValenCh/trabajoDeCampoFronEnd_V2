import React from 'react';
import SearchBar from '../Common/SearchBar';

const InvestigadoresSearch = ({ value, onChange }) => {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Buscar Investigador"
      ariaLabel="Buscar por nombre"
    />
  );
};

export default InvestigadoresSearch;