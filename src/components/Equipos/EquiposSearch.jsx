import React from 'react';
import SearchBar from '../Common/SearchBar';

const EquiposSearch = ({ value, onChange }) => {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Buscar Equipo"
      ariaLabel="Buscar equipo por ID, denominación o monto"
    />
  );
};

export default EquiposSearch;