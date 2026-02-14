import React from 'react';
import EditImg from '../../assets/editarGrupo.png';

/**
 * GrupoActions
 *
 * Tres botones circulares por fila de la tabla.
 *
 * Props:
 *  - grupo: object      → datos del grupo de esa fila
 *  - onVer: function    → abre modal de información
 *  - onEditar: function → abre modal de edición
 *  - onEliminar: function → dispara flujo de eliminación
 */
const GrupoActions = ({ grupo, onVer, onEditar, onEliminar }) => {
  return (
    <div className="group-actions">
      {/* Ver */}
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

      {/* Editar */}
      <button
        className="group-action-btn btn-editar"
        title="Editar grupo"
        onClick={(e) => {
          e.stopPropagation();
          onEditar(grupo);
        }}
      >
        {/* Usa la misma imagen de edición que ya existe en el proyecto */}
        <img
          src={EditImg}
          alt="Editar"
          style={{ width: '18px', height: '18px', objectFit: 'contain' }}
        />
      </button>

      {/* Eliminar */}
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
    </div>
  );
};

export default GrupoActions;