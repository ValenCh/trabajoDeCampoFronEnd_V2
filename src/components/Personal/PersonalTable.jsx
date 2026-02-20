import React from 'react';
import DataTable from '../Common/DataTable';
import PersonalActions from './PersonalActions';
import { obtenerUsuario } from '../../config/permissions';

const formatearTipoPersonal = (tipo) => {
  const tipos = {
    ADMINISTRATIVO: 'Administrativo',
    TECNICO: 'Técnico',
  };
  return tipos[tipo] ?? tipo ?? '-';
};

const PersonalTable = ({ personal, onVer, onEditar, onEliminar }) => {
  const usuario = obtenerUsuario();
  const esAdmin = usuario.role === 'ADMINISTRADOR';

  const columns = [
    {
      key: 'oidPersonal',
      label: 'ID',
      width: '8%',
    },
    {
      key: 'nombre',
      label: 'Nombre',
      width: '20%',
    },
    {
      key: 'apellido',
      label: 'Apellido',
      width: '20%',
    },
    {
      key: 'horasSemanales',
      label: 'Horas',
      width: '12%',
    },
    {
      key: 'tipoPersonal',
      label: 'Tipo',
      width: '20%',
      render: (p) => formatearTipoPersonal(p.tipoPersonal),
    },
    ...(esAdmin ? [{
      key: 'nombreGrupo',
      label: 'Grupo',
      width: '20%',
      render: (p) => p.nombreGrupo ?? '-',
    }] : []),
  ];

  const renderActions = (p) => (
    <PersonalActions
      personal={p}
      onVer={onVer}
      onEditar={onEditar}
      onEliminar={onEliminar}
    />
  );

  return (
    <DataTable
      columns={columns}
      data={personal}
      actions={renderActions}
      keyField="oidPersonal"
      emptyMessage="No se encontró personal"
      className="personal-table-wrapper"
      tableClassName="personal-table"
    />
  );
};

export default PersonalTable;