import React from 'react';

const PersonalActions = ({ personal, onVer, onEditar, onEliminar }) => {
  return (
    <div className="personal-actions">
      <button
        className="personal-action-btn btn-ver"
        onClick={() => onVer(personal)}
        title="Ver detalles"
      >
        <i className="fa-solid fa-eye" />
      </button>

      {onEditar && (
        <button
          className="personal-action-btn btn-editar"
          onClick={() => onEditar(personal)}
          title="Editar"
        >
          <i className="fa-solid fa-pen-to-square" />
        </button>
      )}

      {onEliminar && (
        <button
          className="personal-action-btn btn-eliminar"
          onClick={() => onEliminar(personal.oidPersona)}
          title="Eliminar"
        >
          <i className="fa-solid fa-trash" />
        </button>
      )}
    </div>
  );
};

export default PersonalActions;