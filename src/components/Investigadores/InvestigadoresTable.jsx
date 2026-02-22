import React from 'react';
import DataTable from '../Common/DataTable';
import InvestigadoresActions from './InvestigadoresActions';
import { obtenerUsuario } from '../../config/permissions';

const InvestigadoresTable = ({ investigadores, onVer, onEditar, onEliminar }) => {
  const usuario = obtenerUsuario();
  const esAdmin = usuario.role === 'ADMINISTRADOR';

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      width: '18%',
    },
    {
      key: 'apellido',
      label: 'Apellido',
      width: '18%',
    },
    {
      key: 'horasSemanales',
      label: 'Horas',
      width: '10%',
    },
    {
      key: 'categoriaUTN',
      label: 'Categoría UTN',
      width: '15%',
    },
    {
      key: 'dedicacion',
      label: 'Dedicación',
      width: '13%',
    },
    {
      key: 'gradoAcademico',
      label: 'Grado Académico',
      width: '15%',
    },
    ...(esAdmin ? [{
      key: 'nombreGrupo',
      label: 'Grupo',
      width: '13%',
      render: (i) => i.nombreGrupo ?? '-',
    }] : []),
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

export default InvestigadoresTable;