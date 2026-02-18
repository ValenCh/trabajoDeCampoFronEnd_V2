import React from 'react';
import DataTable from '../Common/DataTable';
import EquipoActions from './EquiposActions';

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '-';
  return fechaISO.split('T')[0].split('-').reverse().join('/');
};

const formatearMonto = (monto) => {
  if (monto == null) return '-';
  return `$${monto.toLocaleString()}`;
};

const EquiposTable = ({ equipos, onVer, onEditar, onEliminar }) => {
  const columns = [
    {
      key: 'oidEquipo',
      label: 'ID',
      width: '8%',
      className: 'col-id',
    },
    {
      key: 'denominacion',
      label: 'Denominación',
      width: '40%',
      className: 'col-denominacion',
    },
    {
      key: 'fechaIncorporacion',
      label: 'Fecha Incorporación',
      width: '20%',
      className: 'col-fecha',
      render: (equipo) => formatearFecha(equipo.fechaIncorporacion),
    },
    {
      key: 'montoInvertido',
      label: 'Monto Invertido',
      width: '20%',
      className: 'col-monto',
      render: (equipo) => formatearMonto(equipo.montoInvertido),
    },
  ];

  const renderActions = (equipo) => (
    <EquipoActions
      equipo={equipo}
      onVer={onVer}
      onEditar={onEditar}
      onEliminar={onEliminar}
    />
  );

  return (
    <DataTable
      columns={columns}
      data={equipos}
      actions={renderActions}
      keyField="oidEquipo"
      emptyMessage="No se encontraron equipos"
      className="equipos-table-wrapper"
      tableClassName="equipos-table"
    />
  );
};

export default EquiposTable;