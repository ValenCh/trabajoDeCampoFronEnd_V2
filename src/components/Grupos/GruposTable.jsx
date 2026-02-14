import React from 'react';
import GrupoRow from './GruposRow';

/**
 * GruposTable
 *
 * Tabla con cabecera fija y filas dinámicas.
 * Recibe la página actual de grupos ya filtrada y paginada.
 *
 * Props:
 *  - grupos: array        → lista de grupos de la página actual
 *  - onVer: function
 *  - onEditar: function
 *  - onEliminar: function
 */
const GruposTable = ({ grupos, onVer, onEditar, onEliminar }) => {
  return (
    <div className="groups-table-wrapper">
      <table className="groups-table">
        <colgroup>
          <col className="col-id" />
          <col className="col-nombre" />
          <col className="col-sigla" />
          <col className="col-acciones" />
        </colgroup>

        <thead>
          <tr>
            <th>Grupo</th>
            <th>Nombre</th>
            <th>Sigla Facultad</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {grupos.length === 0 ? (
            <tr className="groups-empty-row">
              <td colSpan={4}>No se encontraron grupos</td>
            </tr>
          ) : (
            grupos.map((grupo) => (
              <GrupoRow
                key={grupo.oidGrupo}
                grupo={grupo}
                onVer={onVer}
                onEditar={onEditar}
                onEliminar={onEliminar}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GruposTable;