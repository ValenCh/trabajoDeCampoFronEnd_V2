import React from 'react';
import DataTable from '../Common/DataTable';
import DocumentosActions from './DocumentosActions';

const formatearAnio = (anio) => anio ?? '-';

const DocumentosTable = ({ documentos, onVer, onEditar, onDescargar, onEliminar }) => {
  const columns = [
    {
      key: 'oidDocumento',
      label: 'ID',
      width: '10%',
    },
    {
      key: 'titulo',
      label: 'Título',
      width: '55%',
      className: 'col-titulo',
    },
    {
      key: 'anio',
      label: 'Año',
      width: '15%',
      render: (doc) => formatearAnio(doc.anio),
    }
  ];

  const renderActions = (documento) => (
    <DocumentosActions
      documento={documento}
      onVer={onVer}
      onEditar={onEditar}
      onEliminar={onEliminar}
      onDescargar={onDescargar}
    />
  );

  return (
    <DataTable
      columns={columns}
      data={documentos}
      actions={renderActions}
      keyField="oidDocumento"
      emptyMessage="No se encontraron documentos"
      className="documentos-table-wrapper"
      tableClassName="documentos-table"
    />
  );
};

export default DocumentosTable;