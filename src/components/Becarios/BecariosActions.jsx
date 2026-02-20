import React from 'react';

const BecariosActions = ({ becario, onVer, onEditar, onEliminar }) => {
  return (
    <div className="becario-actions">
      <button
        className="becario-action-btn btn-ver"
        onClick={() => onVer(becario)}
        title="Ver detalles"
      >
        <i className="fa-solid fa-eye" />
      </button>

      {onEditar && (
        <button
          className="becario-action-btn btn-editar"
          onClick={() => onEditar(becario)}
          title="Editar"
        >
          <i className="fa-solid fa-pen-to-square" />
        </button>
      )}

      {onEliminar && (
        <button
          className="becario-action-btn btn-eliminar"
          onClick={() => onEliminar(becario.oidPersona)}
          title="Eliminar"
        >
          <i className="fa-solid fa-trash" />
        </button>
      )}
    </div>
  );
};

export default BecariosActions;