import React from 'react';

const IntegrantesCEActions = ({ integrante, onVer, onEditar, onEliminar }) => {
  return (
    <div className="integrantece-actions">
      <button
        className="integrantece-action-btn btn-ver"
        onClick={() => onVer(integrante)}
        title="Ver detalles"
      >
        <i className="fa-solid fa-eye" />
      </button>

      {onEditar && (
        <button
          className="integrantece-action-btn btn-editar"
          onClick={() => onEditar(integrante)}
          title="Editar"
        >
          <i className="fa-solid fa-pen-to-square" />
        </button>
      )}

      {onEliminar && (
        <button
          className="integrantece-action-btn btn-eliminar"
          onClick={() => onEliminar(integrante.oidPersona)}
          title="Eliminar"
        >
          <i className="fa-solid fa-trash" />
        </button>
      )}
    </div>
  );
};

export default IntegrantesCEActions;