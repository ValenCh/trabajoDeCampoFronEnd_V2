import React, { useState, useEffect, useCallback } from 'react';
import IntegrantesCETable from '../components/IntegrantesCE/IntegrantesCETable';
import IntegrantesCESearch from '../components/IntegrantesCE/IntegrantesCESearch';
import IntegrantesCEPaginacion from '../components/IntegrantesCE/IntegrantesCEPaginacion';
import Modal from '../components/Modal/Modal';
import PersonaForm from '../components/Personas/PersonaForm';
import IntegrantesCETableAdmin from '../components/IntegrantesCE/IntegrantesCETableAdmin';
import Alertas from '../components/Alertas/Alertas';

import {
  obtenerUsuario,
  construirHeaders,
  necesitaTabla,
  obtenerEndpointsIntegrantesCE,
  obtenerPermisosIntegrantesCE,
  obtenerEndpointsGrupos,
  esAdministrador,
} from '../config/permissions';

import '../components/IntegrantesCE/IntegrantesCE.css';
import AgregarIcon from '../assets/agregarEquipo.png';

const IntegrantesCEPage = () => {

  const usuario = obtenerUsuario();
  const permisos = obtenerPermisosIntegrantesCE(usuario.role);
  const endpoints = obtenerEndpointsIntegrantesCE(usuario.role);
  const endpointsGrupos = obtenerEndpointsGrupos(usuario.role);
  const itemsPorPagina = 6;

  const [integrantes, setIntegrantes] = useState([]);
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

  const cargarIntegrantes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoints.LISTAR, {
        method: 'GET',
        headers: construirHeaders()
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setIntegrantes(Array.isArray(data) ? data : []);
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
      setAlert({ type: 'error', title: 'Error Grupos', message: err.message });
    }
  }, [endpointsGrupos]);

  useEffect(() => {
    cargarIntegrantes();
    cargarGrupos();
  }, [cargarIntegrantes, cargarGrupos]);

  const integrantesFiltrados = integrantes.filter(i => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      i.nombre?.toLowerCase().includes(s) ||
      i.apellido?.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(integrantesFiltrados.length / itemsPorPagina);

  const integrantesPaginados = integrantesFiltrados.slice(
    (currentPage - 1) * itemsPorPagina,
    currentPage * itemsPorPagina
  );

  const abrirModal = (mode, persona = null) => {
    setModalConfig({ isOpen: true, mode, persona });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, mode: null, persona: null });
  };

  const handleCrearIntegrante = async (formData) => {
    if (esAdministrador(usuario.role) && !formData.oidGrupo) {
      setAlert({ type: 'error', title: 'Error', message: 'Debe seleccionar un grupo' });
      return;
    }

    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      horasSemanales: Number(formData.horasSemanales),
      tipoPersona: 'IntegranteConsejoEducativo',
      cargo: formData.cargo,
    };

    try {
      const url = esAdministrador(usuario.role)
        ? endpoints.CREAR(formData.oidGrupo)
        : endpoints.CREAR;

      const response = await fetch(url, {
        method: 'POST',
        headers: construirHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(await response.text());

      cerrarModal();
      cargarIntegrantes();
      setAlert({ type: 'exito', title: 'Creado', message: 'Integrante CE creado correctamente' });

    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleEditarIntegrante = async (formData) => {
    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      horasSemanales: Number(formData.horasSemanales),
      tipoPersona: 'IntegranteConsejoEducativo',
      cargo: formData.cargo,
    };

    try {
      const response = await fetch(
        endpoints.ACTUALIZAR(modalConfig.persona.oidPersona),
        {
          method: 'PUT',
          headers: construirHeaders(),
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) throw new Error(await response.text());

      cerrarModal();
      cargarIntegrantes();
      setAlert({ type: 'exito', title: 'Actualizado', message: 'Integrante CE actualizado correctamente' });

    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleEliminarIntegrante = (id) => {
    setAlert({
      type: 'advertencia',
      title: 'Desactivar integrante CE',
      message: '¿Seguro que querés desactivar este integrante CE?',
      onAccept: async () => {
        try {
          const response = await fetch(endpoints.ELIMINAR(id), {
            method: 'PUT',
            headers: construirHeaders()
          });

          if (!response.ok) throw new Error(await response.text());

          cargarIntegrantes();
          setAlert({ type: 'exito', title: 'Desactivado', message: 'Integrante CE quitado correctamente' });

        } catch (err) {
          setAlert({ type: 'error', title: 'Error', message: err.message });
        }
      }
    });
  };

  const handleFormSubmit = (formData) => {
    if (modalConfig.mode === 'crear') handleCrearIntegrante(formData);
    if (modalConfig.mode === 'editar') handleEditarIntegrante(formData);
  };

  if (loading) return <p>Cargando integrantes CE...</p>;
  if (error) return <div><p>Error: {error}</p><button onClick={cargarIntegrantes}>Reintentar</button></div>;
  if (!necesitaTabla(usuario.role)) return <p>No tienes permisos para ver integrantes CE</p>;

  return (
    <div className="integrantece-page">

      <div className="integrantece-header">
        <h1 className="integrantece-title">Gestión de Integrantes del Consejo Educativo</h1>
      </div>

      <div className="integrantece-toolbar">
        {permisos.buscar && (
          <IntegrantesCESearch
            value={searchTerm}
            onChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
          />
        )}
        {permisos.crear && (
          <button className="btn-crear-integrantece" onClick={() => abrirModal('crear')}>
            <img src={AgregarIcon} alt="Nuevo Integrante CE" />
          </button>
        )}
      </div>

      {esAdministrador(usuario.role)
        ? <IntegrantesCETableAdmin
            integrantes={integrantesPaginados}
            onVer={(i) => abrirModal('ver', i)}
            onEditar={permisos.editar ? (i) => abrirModal('editar', i) : null}
            onEliminar={permisos.eliminar ? handleEliminarIntegrante : null}
          />
        : <IntegrantesCETable
            integrantes={integrantesPaginados}
            onVer={(i) => abrirModal('ver', i)}
            onEditar={permisos.editar ? (i) => abrirModal('editar', i) : null}
            onEliminar={permisos.eliminar ? handleEliminarIntegrante : null}
          />
      }

      {totalPages > 1 && (
        <IntegrantesCEPaginacion
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
            modalConfig.mode === 'crear' ? 'Nuevo Integrante CE' :
            modalConfig.mode === 'editar' ? 'Editar Integrante CE' :
            'Detalle del Integrante CE'
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
            tipoPersona="IntegranteConsejoEducativo"
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

export default IntegrantesCEPage;