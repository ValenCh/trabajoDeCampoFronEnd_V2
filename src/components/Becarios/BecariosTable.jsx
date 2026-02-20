import React from 'react';
import DataTable from '../Common/DataTable';
import BecarioActions from './BecariosActions';
import { obtenerUsuario } from '../../config/permissions';

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

const BecariosTable = ({ becarios, onVer, onEditar, onEliminar }) => {
  const usuario = obtenerUsuario();
  const esAdmin = usuario.role === 'ADMINISTRADOR';

  const columns = [
    {
      key: 'oidBecario',
      label: 'ID',
      width: '8%',
    },
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
      key: 'fuenteFinanciamiento',
      label: 'Fuente',
      width: '15%',
    },
    {
      key: 'tipoBecario',
      label: 'Tipo',
      width: '18%',
      render: (b) => formatearTipoBecario(b.tipoBecario),
    },
    ...(esAdmin ? [{
      key: 'nombreGrupo',
      label: 'Grupo',
      width: '13%',
      render: (b) => b.nombreGrupo ?? '-',
    }] : []),
  ];

  const renderActions = (becario) => (
    <BecarioActions
      becario={becario}
      onVer={onVer}
      onEditar={onEditar}
      onEliminar={onEliminar}
    />
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

export default BecariosTable;