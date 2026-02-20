import React from 'react';
import SearchBar from '../Common/SearchBar';

const IntegrantesCESearch = ({ value, onChange }) => {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Buscar integrante del consejo educativo"
      ariaLabel="Buscar por nombre"
    />
  );
};

export default IntegrantesCESearch;