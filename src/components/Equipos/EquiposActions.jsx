import React from 'react';

const EquipoActions = ({ equipo, onVer, onEditar, onEliminar }) => {
  return (
    <div className="equipo-actions">
      <button
        className="equipo-action-btn btn-ver"
        onClick={() => onVer(equipo)}
        title="Ver detalles"
      >
        <i className="fa-solid fa-eye" />
      </button>

      {onEditar && (
        <button
          className="equipo-action-btn btn-editar"
          onClick={() => onEditar(equipo)}
          title="Editar"
        >
          <i className="fa-solid fa-pen-to-square" />
        </button>
      )}

      {onEliminar && (
        <button
          className="equipo-action-btn btn-eliminar"
          onClick={() => onEliminar(equipo.oidEquipo)}
          title="Eliminar"
        >
          <i className="fa-solid fa-trash" />
        </button>
      )}
    </div>
  );
};

export default EquipoActions;