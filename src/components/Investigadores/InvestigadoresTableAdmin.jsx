import React from 'react';
import DataTable from '../Common/DataTable';
import InvestigadoresActions from './InvestigadoresActions';

const InvestigadoresTableAdmin = ({ investigadores, onVer, onEditar, onEliminar }) => {
  const columns = [
    { key: 'oidInvestigador', label: 'ID', width: '8%' },
    { key: 'nombre', label: 'Nombre', width: '15%' },
    { key: 'apellido', label: 'Apellido', width: '15%' },
    { key: 'horasSemanales', label: 'Horas', width: '8%' },
    { key: 'categoriaUTN', label: 'Categoría UTN', width: '13%' },
    { key: 'dedicacion', label: 'Dedicación', width: '12%' },
    { key: 'gradoAcademico', label: 'Grado Académico', width: '13%' },
    { key: 'nombreGrupo', label: 'Grupo', width: '13%', render: (i) => i.nombreGrupo ?? '-' },
  ];

  const renderActions = (investigador) => (
    <InvestigadoresActions
      investigador={investigador}
      onVer={onVer}
      onEditar={onEditar}
      onEliminar={onEliminar}
    />
  );

  return (
    <DataTable
      columns={columns}
      data={investigadores}
      actions={renderActions}
      keyField="oidInvestigador"
      emptyMessage="No se encontraron investigadores"
      className="investigadores-table-wrapper"
      tableClassName="investigadores-table"
    />
  );
};

export default InvestigadoresTableAdmin;