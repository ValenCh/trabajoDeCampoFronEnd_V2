import React, { useState, useEffect, useCallback } from 'react';
import InvestigadoresTable from '../components/Investigadores/InvestigadoresTable';
import InvestigadoresSearch from '../components/Investigadores/InvestigadoresSearch';
import InvestigadoresPaginacion from '../components/Investigadores/InvestigadoresPaginacion';
import Modal from '../components/Modal/Modal';
import PersonaForm from '../components/Personas/PersonaForm';
import InvestigadoresTableAdmin from '../components/Investigadores/InvestigadoresTableAdmin';
import Alertas from '../components/Alertas/Alertas';

import {
  obtenerUsuario,
  construirHeaders,
  necesitaTabla,
  obtenerEndpointsInvestigadores,
  obtenerPermisosInvestigadores,
  obtenerEndpointsGrupos,
  esAdministrador,
} from '../config/permissions';

import '../components/Investigadores/Investigadores.css';
import AgregarIcon from '../assets/agregarEquipo.png';

const InvestigadoresPage = () => {

  const itemsPorPagina = 6;
  const usuario = obtenerUsuario();
  const permisos = obtenerPermisosInvestigadores(usuario.role);
  const endpoints = obtenerEndpointsInvestigadores(usuario.role);
  const endpointsGrupos = obtenerEndpointsGrupos(usuario.role);

  const [investigadores, setInvestigadores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: null,
    persona: null
  });

  const cargarInvestigadores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoints.LISTAR, {
        method: 'GET',
        headers: construirHeaders()
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setInvestigadores(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoints]);

  const cargarGrupos = useCallback(async () => {
    try {
      const url = endpointsGrupos.LISTAR || endpointsGrupos.VER;
      if (!url) return;
      const response = await fetch(url, { headers: construirHeaders() });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setGrupos(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error('❌ Error grupos:', err.message);
    }
  }, [endpointsGrupos]);

  useEffect(() => {
    cargarInvestigadores();
    cargarGrupos();
  }, [cargarInvestigadores, cargarGrupos]);

  const investigadoresFiltrados = investigadores.filter(i => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      i.nombre?.toLowerCase().includes(s) ||
      i.apellido?.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(investigadoresFiltrados.length / itemsPorPagina);

  const investigadoresPaginados = investigadoresFiltrados.slice(
    (currentPage - 1) * itemsPorPagina,
    currentPage * itemsPorPagina
  );

  const abrirModal = (mode, persona = null) => {
    setModalConfig({ isOpen: true, mode, persona });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, mode: null, persona: null });
  };

  const handleCrearInvestigador = async (formData) => {
    if (esAdministrador(usuario.role) && !formData.oidGrupo) {
      setAlert({ type: 'error', title: 'Error', message: 'Debe seleccionar un grupo' });
      return;
    }

    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      horasSemanales: Number(formData.horasSemanales),
      tipoPersona: 'Investigador',
      categoriaUTN: formData.categoriaUTN,
      programaDeIncentivos: formData.programaDeIncentivos,
      dedicacion: formData.dedicacion,
      gradoAcademico: formData.gradoAcademico
    };

    try {
      const url = esAdministrador(usuario.role)
        ? endpoints.CREAR(formData.oidGrupo)
        : endpoints.CREAR;

      const response = await fetch(url, {
        method: 'POST',
        headers: construirHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(await response.text());

      cerrarModal();
      cargarInvestigadores();
      setAlert({ type: 'exito', title: 'Creado', message: 'Investigador creado correctamente' });

    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleEditarInvestigador = async (formData) => {
    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      horasSemanales: Number(formData.horasSemanales),
      tipoPersona: 'Investigador',
      categoriaUTN: formData.categoriaUTN || null,
      programaDeIncentivos: formData.programaDeIncentivos || null,
      dedicacion: formData.dedicacion || null,
      gradoAcademico: formData.gradoAcademico || null
    };

    try {
      const response = await fetch(
        endpoints.ACTUALIZAR(modalConfig.persona.oidPersona),
        {
          method: 'PUT',
          headers: construirHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      cerrarModal();
      cargarInvestigadores();
      setAlert({ type: 'exito', title: 'Actualizado', message: 'Investigador actualizado correctamente' });

    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleEliminarInvestigador = (id) => {
    setAlert({
      type: 'advertencia',
      title: 'Desactivar investigador',
      message: '¿Seguro que querés desactivar este investigador?',
      onAccept: async () => {
        try {
          const response = await fetch(endpoints.ELIMINAR(id), {
            method: 'PUT',
            headers: construirHeaders()
          });

          if (!response.ok) throw new Error('No se pudo desactivar el investigador');

          cargarInvestigadores();
          setAlert({ type: 'exito', title: 'Desactivado', message: 'Investigador quitado correctamente' });

        } catch (err) {
          setAlert({ type: 'error', title: 'Error', message: err.message });
        }
      }
    });
  };

  const handleFormSubmit = (formData) => {
    if (modalConfig.mode === 'crear') handleCrearInvestigador(formData);
    if (modalConfig.mode === 'editar') handleEditarInvestigador(formData);
  };

  if (loading) return <p>Cargando investigadores...</p>;
  if (error) return <div><p>Error: {error}</p><button onClick={cargarInvestigadores}>Reintentar</button></div>;
  if (!necesitaTabla(usuario.role)) return <p>No tienes permisos para ver investigadores</p>;

  return (
    <div className="investigadores-page">

      <div className="investigadores-header">
        <h1 className="investigadores-title">Gestión de Investigadores</h1>
      </div>

      <div className="investigadores-toolbar">

        {permisos.buscar && (
          <InvestigadoresSearch
            value={searchTerm}
            onChange={(v) => {
              setSearchTerm(v);
              setCurrentPage(1);
            }}
          />
        )}

        {permisos.crear && (
          <button
            className="btn-crear-investigador"
            onClick={() => abrirModal('crear')}
          >
            <img src={AgregarIcon} alt="Nuevo Investigador" />
          </button>
        )}

      </div>

      {esAdministrador(usuario.role)
        ? <InvestigadoresTableAdmin
            investigadores={investigadoresPaginados}
            onVer={(i) => abrirModal('ver', i)}
            onEditar={permisos.editar ? (i) => abrirModal('editar', i) : null}
            onEliminar={permisos.eliminar ? handleEliminarInvestigador : null}
          />
        : <InvestigadoresTable
            investigadores={investigadoresPaginados}
            onVer={(i) => abrirModal('ver', i)}
            onEditar={permisos.editar ? (i) => abrirModal('editar', i) : null}
            onEliminar={permisos.eliminar ? handleEliminarInvestigador : null}
          />
      }

      {totalPages > 1 && (
        <InvestigadoresPaginacion
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {modalConfig.isOpen && (
        <Modal
          isOpen={modalConfig.isOpen}
          onClose={cerrarModal}
          title={
            modalConfig.mode === 'crear' ? 'Nuevo Investigador' :
            modalConfig.mode === 'editar' ? 'Editar Investigador' :
            'Detalle del Investigador'
          }
          buttons={
            modalConfig.mode === 'ver'
              ? [{ label: 'Cerrar', onClick: cerrarModal, variant: 'secondary' }]
              : [
                  { label: 'Cancelar', onClick: cerrarModal, variant: 'secondary' },
                  {
                    label: modalConfig.mode === 'crear' ? 'Crear' : 'Guardar',
                    type: 'submit',
                    formId: 'personaForm',
                    variant: 'primary'
                  }
                ]
          }
        >
          <PersonaForm
            formId="personaForm"
            initialData={modalConfig.persona}
            tipoPersona="Investigador"
            modo={modalConfig.mode}
            onSubmit={handleFormSubmit}
            grupos={grupos}
          />
        </Modal>
      )}

      {alert && (
        <Alertas
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
          onCancel={() => setAlert(null)}
          onAccept={() => {
            if (alert.onAccept) alert.onAccept();
            setAlert(null);
          }}
        />
      )}

    </div>
  );
};

export default InvestigadoresPage;