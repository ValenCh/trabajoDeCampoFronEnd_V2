import React from 'react';
import DataTable from '../Common/DataTable';
import BecarioActions from './BecariosActions';

const formatearTipoBecario = (tipo) => {
  const tipos = {
    Doctorado: 'Doctorado',
    MaestriaYOEspecializacion: 'Maestría o Especialización',
    BecarioGraduado: 'Becario Graduado',
    BecarioAlumno: 'Becario Alumno',
    Pasante: 'Pasante',
    ProyectoFinalYTesinaDeGradoYOTrabajoFinalYTesisDePosgrado: 'Proyecto Final / Tesis',
  };
  return tipos[tipo] ?? tipo ?? '-';
};

const BecariosTableAdmin = ({ becarios, onVer, onEditar, onEliminar }) => {
  const columns = [
    { key: 'oidBecario', label: 'ID', width: '8%' },
    { key: 'nombre', label: 'Nombre', width: '15%' },
    { key: 'apellido', label: 'Apellido', width: '15%' },
    { key: 'horasSemanales', label: 'Horas', width: '8%' },
    { key: 'fuenteFinanciamiento', label: 'Fuente', width: '13%' },
    { key: 'tipoBecario', label: 'Tipo', width: '18%', render: (b) => formatearTipoBecario(b.tipoBecario) },
    { key: 'nombreGrupo', label: 'Grupo', width: '13%', render: (b) => b.nombreGrupo ?? '-' },
  ];

  const renderActions = (becario) => (
    <BecarioActions becario={becario} onVer={onVer} onEditar={onEditar} onEliminar={onEliminar} />
  );

  return (
    <DataTable
      columns={columns}
      data={becarios}
      actions={renderActions}
      keyField="oidBecario"
      emptyMessage="No se encontraron becarios"
      className="becarios-table-wrapper"
      tableClassName="becarios-table"
    />
  );
};

export default BecariosTableAdmin;