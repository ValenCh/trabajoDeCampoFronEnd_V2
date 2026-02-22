import React from 'react';
import DataTable from '../Common/DataTable';
import IntegrantesConsejoEducativoActions from './IntegrantesCEActions';

const IntegrantesCETableAdmin = ({ integrantes, onVer, onEditar, onEliminar }) => {
  const columns = [
    { key: 'oidIntegranteConsejoEducativo', label: 'ID', width: '8%' },
    { key: 'nombre', label: 'Nombre', width: '20%' },
    { key: 'apellido', label: 'Apellido', width: '20%' },
    { key: 'horasSemanales', label: 'Horas', width: '10%' },
    { key: 'cargo', label: 'Cargo', width: '20%', render: (i) => i.cargo ?? '-' },
    { key: 'nombreGrupo', label: 'Grupo', width: '14%', render: (i) => i.nombreGrupo ?? '-' },
  ];

  const renderActions = (integrante) => (
    <IntegrantesConsejoEducativoActions
      integrante={integrante}
      onVer={onVer}
      onEditar={onEditar}
      onEliminar={onEliminar}
    />
  );

  return (
    <DataTable
      columns={columns}
      data={integrantes}
      actions={renderActions}
      keyField="oidIntegranteConsejoEducativo"
      emptyMessage="No se encontraron integrantes del consejo educativo"
      className="integrantece-table-wrapper"
      tableClassName="integrantece-table"
    />
  );
};

export default IntegrantesCETableAdmin;