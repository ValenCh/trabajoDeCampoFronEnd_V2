import React from 'react';
import './SearchBar.css';

/**
 * SearchBar - Componente de búsqueda reutilizable
 *
 * Props:
 *  - value: string           → valor actual del input (estado controlado)
 *  - onChange: function      → recibe el nuevo string al escribir
 *  - placeholder: string     → texto del placeholder (default: "Buscar...")
 *  - onSearch: function      → callback opcional al hacer click en el botón
 *  - showButton: boolean     → mostrar el botón de búsqueda (default: true)
 *  - disabled: boolean       → deshabilitar el input
 *  - className: string       → clase adicional para el wrapper
 *  - inputClassName: string  → clase adicional para el input
 *  - autoFocus: boolean      → autofocus en el input
 *  - ariaLabel: string       → label para accesibilidad
 *
 * Ejemplo de uso:
 *
 * <SearchBar
 *   value={busqueda}
 *   onChange={setBusqueda}
 *   placeholder="Buscar grupos..."
 *   ariaLabel="Buscar grupo por número o nombre"
 * />
 */
const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Buscar...',
  onSearch,
  showButton = true,
  disabled = false,
  className = '',
  inputClassName = '',
  autoFocus = false,
  ariaLabel = 'Búsqueda',
}) => {
  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleButtonClick = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`search-bar-wrapper ${className}`.trim()}>
      <div className="search-bar-container">
        <input
          type="text"
          className={`search-bar-input ${inputClassName}`.trim()}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
        />
      </div>
      {showButton && (
        <button
          className="search-bar-btn"
          onClick={handleButtonClick}
          disabled={disabled}
          title="Buscar"
          aria-label="Buscar"
        >
          <i className="fa-solid fa-magnifying-glass" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;