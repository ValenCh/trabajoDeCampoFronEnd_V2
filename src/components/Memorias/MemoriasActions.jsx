import React from 'react';
import { useNavigate } from 'react-router-dom';

const MemoriasActions = ({ memoria, onExportar, permisos }) => {
  const navigate = useNavigate();

  return (
    <div className="memorias-actions">

      {/* Ver detalle - solo lectura */}
      <button
        className="btn-action"
        title="Ver memoria"
        onClick={() => navigate(`/memorias/${memoria.oidMemoria}`, { state: { modo: 'ver' } })}
      >
      </button>

      {/* Gestionar - agregar/quitar recursos */}
      {permisos?.editar && (
        <button
          className="btn-action"
          title="Gestionar memoria"
          onClick={() => navigate(`/memorias/${memoria.oidMemoria}`, { state: { modo: 'editar' } })}
        >
        </button>
      )}

      {/* Exportar Excel */}
      <button
        className="btn-action"
        title="Exportar a Excel"
        onClick={() => onExportar(memoria.oidMemoria)}
      >
      </button>

    </div>
  );
};

export default MemoriasActions;