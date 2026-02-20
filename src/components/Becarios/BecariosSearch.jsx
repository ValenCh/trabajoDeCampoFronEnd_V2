import React from 'react';
import SearchBar from '../Common/SearchBar';

const BecariosSearch = ({ value, onChange }) => {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Buscar becario"
      ariaLabel="Buscar por nombre"
    />
  );
};

export default BecariosSearch;