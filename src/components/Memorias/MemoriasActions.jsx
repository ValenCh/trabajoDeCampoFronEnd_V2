import React from 'react';
import { useNavigate } from 'react-router-dom';

const MemoriasActions = ({ memoria, onExportar, permisos }) => {
  const navigate = useNavigate();

  return (
    <div className="memorias-actions">

      <button
        className="documento-action-btn btn-ver"
        title="Ver memoria"
        onClick={() => navigate(`/memorias/${memoria.oidMemoria}`, { state: { modo: 'ver' } })}
      >
        <i className="fa-solid fa-eye" />
      </button>

      {permisos?.editar && (
        <button
          className="documento-action-btn btn-editar"
          title="Gestionar memoria"
          onClick={() => navigate(`/memorias/${memoria.oidMemoria}`, { state: { modo: 'editar' } })}
        >
          <i className="fa-solid fa-pen-to-square" />
        </button>
      )}

      <button
        className="documento-action-btn btn-descargar"
        title="Exportar a Excel"
        onClick={() => onExportar(memoria.oidMemoria)}
      >
        <i className="fa-solid fa-file-excel" />
      </button>

    </div>
  );
};

export default MemoriasActions;