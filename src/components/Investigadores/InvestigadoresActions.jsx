import React from 'react';

const InvestigadoresActions = ({ investigador, onVer, onEditar, onEliminar }) => {
  return (
    <div className="investigador-actions">
      <button
        className="investigador-action-btn btn-ver"
        onClick={() => onVer(investigador)}
        title="Ver detalles"
      >
        <i className="fa-solid fa-eye" />
      </button>

      {onEditar && (
        <button
          className="investigador-action-btn btn-editar"
          onClick={() => onEditar(investigador)}
          title="Editar"
        >
          <i className="fa-solid fa-pen-to-square" />
        </button>
      )}

      {onEliminar && (
        <button
          className="investigador-action-btn btn-eliminar"
          onClick={() => onEliminar(investigador.oidPersona)}
          title="Eliminar"
        >
          <i className="fa-solid fa-trash" />
        </button>
      )}
    </div>
  );
};

export default InvestigadoresActions;