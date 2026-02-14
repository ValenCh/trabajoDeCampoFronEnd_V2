import React from 'react';

/**
 * GruposSearch
 *
 * Barra de búsqueda controlada.
 * El filtrado real ocurre en GroupsPage (búsqueda local).
 *
 * Props:
 *  - value: string       → valor actual del input (estado controlado)
 *  - onChange: function  → recibe el nuevo string al escribir
 */
const GruposSearch = ({ value, onChange }) => {
  return (
    <div className="groups-search-wrapper">
      <div className="groups-search-container">
        <input
          type="text"
          className="groups-search-input"
          placeholder="Buscar Grupo"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Buscar grupo por número o nombre"
        />
      </div>
      <button
        className="groups-search-btn"
        title="Buscar"
        aria-label="Buscar"
        // La búsqueda es reactiva (onChange), el botón es solo UX decorativo
        // Si en el futuro se quiere búsqueda por endpoint, aquí va el onClick
        onClick={() => {}}
      >
        <i className="fa-solid fa-magnifying-glass" />
      </button>
    </div>
  );
};

export default GruposSearch;