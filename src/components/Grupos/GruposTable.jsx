import React from 'react';
import DataTable from '../Common/DataTable';
import GrupoActions from './GruposActions';

/**
 * GruposTable
 *
 * Tabla específica para grupos usando el componente DataTable reutilizable.
 * Define las columnas y configuración específica de grupos.
 *
 * Props:
 *  - grupos: array        → lista de grupos de la página actual
 *  - onVer: function
 *  - onEditar: function
 *  - onEliminar: function
 */
const GruposTable = ({ grupos, onVer, onEditar, onEliminar }) => {
  // Definir las columnas específicas de grupos
  const columns = [
    {
      key: 'oidGrupo',
      label: 'oidGrupo',
      width: '12%',
      className: 'col-id',
    },
    {
      key: 'nombreGrupo',
      label: 'Nombre',
      width: '35%',
      className: 'col-nombre',
    },
    {
      key: 'sigla',
      label: 'Sigla Facultad',
      width: '25%',
      className: 'col-sigla',
    },
  ];

  // Renderizar las acciones para cada fila
  const renderActions = (grupo) => (
    <GrupoActions
      grupo={grupo}
      onVer={onVer}
      onEditar={onEditar}
      onEliminar={onEliminar}
    />
  );

  return (
    <DataTable
      columns={columns}
      data={grupos}
      actions={renderActions}
      keyField="oidGrupo"
      emptyMessage="No se encontraron grupos"
      className="groups-table-wrapper"
      tableClassName="groups-table"
    />
  );
};

export default GruposTable;