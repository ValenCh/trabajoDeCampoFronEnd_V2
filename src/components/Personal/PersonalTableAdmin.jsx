import React from 'react';
import DataTable from '../Common/DataTable';
import PersonalActions from './PersonalActions';

const formatearTipoPersonal = (tipo) => {
  const tipos = { ADMINISTRATIVO: 'Administrativo', TECNICO: 'Técnico' };
  return tipos[tipo] ?? tipo ?? '-';
};

const PersonalTableAdmin = ({ personal, onVer, onEditar, onEliminar }) => {
  const columns = [
    { key: 'oidPersonal', label: 'ID', width: '8%' },
    { key: 'nombre', label: 'Nombre', width: '18%' },
    { key: 'apellido', label: 'Apellido', width: '18%' },
    { key: 'horasSemanales', label: 'Horas', width: '10%' },
    { key: 'tipoPersonal', label: 'Tipo', width: '18%', render: (p) => formatearTipoPersonal(p.tipoPersonal) },
    { key: 'nombreGrupo', label: 'Grupo', width: '18%', render: (p) => p.nombreGrupo ?? '-' },
  ];

  const renderActions = (p) => (
    <PersonalActions personal={p} onVer={onVer} onEditar={onEditar} onEliminar={onEliminar} />
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

export default PersonalTableAdmin;