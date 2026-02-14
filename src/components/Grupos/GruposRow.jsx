import React from 'react';
import GrupoActions from './GruposActions';

/**
 * GrupoRow
 *
 * Fila individual de la tabla.
 * Recibe los datos de un grupo y los callbacks de acción.
 *
 * Props:
 *  - grupo: object        → { oidGrupo, nombreGrupo, sigla, email, director, viceDirector }
 *  - onVer: function
 *  - onEditar: function
 *  - onEliminar: function
 */
const GrupoRow = ({ grupo, onVer, onEditar, onEliminar }) => {
  return (
    <tr>
      <td>{grupo.oidGrupo}</td>
      <td>{grupo.nombreGrupo}</td>
      <td>{grupo.sigla}</td>
      <td>
        <GrupoActions
          grupo={grupo}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      </td>
    </tr>
  );
};

export default GrupoRow;