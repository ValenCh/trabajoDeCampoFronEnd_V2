import React from 'react';
import SearchBar from '../Common/SearchBar';

const PersonalSearch = ({ value, onChange }) => {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Buscar personal"
      ariaLabel="Buscar por nombre"
    />
  );
};

export default PersonalSearch;