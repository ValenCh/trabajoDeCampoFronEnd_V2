import React from 'react';

const DocumentoActions = ({ documento, onVer, onEditar, onEliminar, onDescargar }) => {
  return (
    <div className="documento-actions">
      <button
        className="documento-action-btn btn-ver"
        onClick={() => onVer(documento)}
        title="Ver detalles"
      >
        <i className="fa-solid fa-eye" />
      </button>

      {onEditar && (
        <button
          className="documento-action-btn btn-editar"
          onClick={() => onEditar(documento)}
          title="Editar"
        >
          <i className="fa-solid fa-pen-to-square" />
        </button>
      )}

      {onEliminar && (
        <button
          className="equipo-action-btn btn-eliminar"
          onClick={() => onEliminar(documento.oidDocumento)}
          title="Eliminar"
        >
          <i className="fa-solid fa-trash" />
        </button>
      )}

      {onDescargar && (
        <button
          className="documento-action-btn btn-descargar"
          onClick={() => onDescargar(documento)}
          title="Descargar"
        >
          <i className="fa-solid fa-download" />
        </button>
      )}
    </div>
  );
};

export default DocumentoActions;