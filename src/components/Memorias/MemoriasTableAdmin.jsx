import React from 'react';
import DataTable from '../Common/DataTable';
import MemoriasActions from './MemoriasActions';

const MemoriasTableAdmin = ({ memorias, onExportar, permisos }) => {
  const columns = [
    { key: 'oidMemoria', label: 'ID', width: '10%' },
    { key: 'anio', label: 'Año', width: '20%' },
    {
      key: 'nombreGrupo',
      label: 'Grupo',
      width: '70%',
      render: (m) => m.nombreGrupo || '-',
    },
  ];

  const renderActions = (memoria) => (
    <MemoriasActions
      memoria={memoria}
      onExportar={onExportar}
      permisos={permisos}
    />
  );

  return (
    <DataTable
      columns={columns}
      data={memorias}
      actions={renderActions}
      keyField="oidMemoria"
      emptyMessage="No se encontraron memorias"
      className="memorias-table-wrapper"
      tableClassName="memorias-table"
    />
  );
};

export default MemoriasTableAdmin;