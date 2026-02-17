import React from 'react';
import EditImg from '../../assets/editarGrupo.png';

/**
 * GrupoActions
 *
 * Tres botones circulares por fila de la tabla.
 * Los botones se muestran/ocultan según los permisos pasados.
 *
 * Props:
 *  - grupo: object          → datos del grupo de esa fila
 *  - onVer: function        → abre modal de información
 *  - onEditar: function     → abre modal de edición (null = ocultar botón)
 *  - onEliminar: function   → dispara flujo de eliminación (null = ocultar botón)
 */
const GrupoActions = ({ grupo, onVer, onEditar, onEliminar }) => {
  return (
    <div className="group-actions">
      {/* Ver - siempre visible */}
      <button
        className="group-action-btn btn-ver"
        title="Ver información"
        onClick={(e) => {
          e.stopPropagation();
          onVer(grupo);
        }}
      >
        <i className="fa-solid fa-magnifying-glass" />
      </button>

      {/* Editar - solo si tiene permisos */}
      {onEditar && (
        <button
          className="group-action-btn btn-editar"
          title="Editar grupo"
          onClick={(e) => {
            e.stopPropagation();
            onEditar(grupo);
          }}
        >
          <img
            src={EditImg}
            alt="Editar"
            style={{ width: '18px', height: '18px', objectFit: 'contain' }}
          />
        </button>
      )}

      {/* Eliminar - solo si tiene permisos */}
      {onEliminar && (
        <button
          className="group-action-btn btn-eliminar"
          title="Eliminar grupo"
          onClick={(e) => {
            e.stopPropagation();
            onEliminar(grupo.oidGrupo);
          }}
        >
          <i className="fa-solid fa-trash" />
        </button>
      )}
    </div>
  );
};

export default GrupoActions;