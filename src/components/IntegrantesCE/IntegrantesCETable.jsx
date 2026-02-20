import React from 'react';
import DataTable from '../Common/DataTable';
import IntegrantesConsejoEducativoActions from './IntegrantesCEActions';
import { obtenerUsuario } from '../../config/permissions';

const IntegrantesCETable = ({ integrantes, onVer, onEditar, onEliminar }) => {
  const usuario = obtenerUsuario();
  const esAdmin = usuario.role === 'ADMINISTRADOR';

  const columns = [
    {
      key: 'oidIntegranteConsejoEducativo',
      label: 'ID',
      width: '8%',
    },
    {
      key: 'nombre',
      label: 'Nombre',
      width: '22%',
    },
    {
      key: 'apellido',
      label: 'Apellido',
      width: '22%',
    },
    {
      key: 'horasSemanales',
      label: 'Horas',
      width: '12%',
    },
    {
      key: 'cargo',
      label: 'Cargo',
      width: '22%',
      render: (i) => i.cargo ?? '-',
    },
    ...(esAdmin ? [{
      key: 'nombreGrupo',
      label: 'Grupo',
      width: '14%',
      render: (i) => i.nombreGrupo ?? '-',
    }] : []),
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

export default IntegrantesCETable;