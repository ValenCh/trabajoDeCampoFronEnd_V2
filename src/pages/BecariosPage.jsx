import React, { useState, useEffect, useCallback } from 'react';
import BecariosTable from '../components/Becarios/BecariosTable';
import BecariosSearch from '../components/Becarios/BecariosSearch';
import BecariosPaginacion from '../components/Becarios/BecariosPaginacion';
import Modal from '../components/Modal/Modal';
import PersonaForm from '../components/Personas/PersonaForm';
import BecariosTableAdmin from '../components/Becarios/BecariosTableAdmin';
import Alertas from '../components/Alertas/Alertas';

import {
  obtenerUsuario,
  construirHeaders,
  necesitaTabla,
  obtenerEndpointsBecarios,
  obtenerPermisosBecarios,
  obtenerEndpointsGrupos,
  esAdministrador,
} from '../config/permissions';

import '../components/Becarios/Becarios.css';
import AgregarIcon from '../assets/agregarEquipo.png';

const BecariosPage = () => {

  const itemsPorPagina = 10;
  const usuario = obtenerUsuario();
  const permisos = obtenerPermisosBecarios(usuario.role);
  const endpoints = obtenerEndpointsBecarios(usuario.role);
  const endpointsGrupos = obtenerEndpointsGrupos(usuario.role);

  const [becarios, setBecarios] = useState([]);
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

  const cargarBecarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoints.LISTAR, {
        method: 'GET',
        headers: construirHeaders()
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setBecarios(Array.isArray(data) ? data : []);
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
    cargarBecarios();
    cargarGrupos();
  }, [cargarBecarios, cargarGrupos]);

  const becariosFiltrados = becarios.filter(b => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      b.nombre?.toLowerCase().includes(s) ||
      b.apellido?.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(becariosFiltrados.length / itemsPorPagina);

  const becariosPaginados = becariosFiltrados.slice(
    (currentPage - 1) * itemsPorPagina,
    currentPage * itemsPorPagina
  );

  const abrirModal = (mode, persona = null) => {
    setModalConfig({ isOpen: true, mode, persona });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, mode: null, persona: null });
  };

  const handleCrearBecario = async (formData) => {
    if (esAdministrador(usuario.role) && !formData.oidGrupo) {
      setAlert({ type: 'error', title: 'Error', message: 'Debe seleccionar un grupo' });
      return;
    }

    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      horasSemanales: Number(formData.horasSemanales),
      tipoPersona: 'Becario',
      fuenteFinanciamiento: formData.fuenteFinanciamiento,
      tipoBecario: formData.tipoBecario,
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
      cargarBecarios();
      setAlert({ type: 'exito', title: 'Creado', message: 'Becario creado correctamente' });

    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleEditarBecario = async (formData) => {
    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      horasSemanales: Number(formData.horasSemanales),
      tipoPersona: 'Becario',
      fuenteFinanciamiento: formData.fuenteFinanciamiento || null,
      tipoBecario: formData.tipoBecario || null,
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
      cargarBecarios();
      setAlert({ type: 'exito', title: 'Actualizado', message: 'Becario actualizado correctamente' });

    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleEliminarBecario = (id) => {
    setAlert({
      type: 'advertencia',
      title: 'Desactivar becario',
      message: '¿Seguro que querés desactivar este becario?',
      onAccept: async () => {
        try {
          const response = await fetch(endpoints.ELIMINAR(id), {
            method: 'PUT',
            headers: construirHeaders()
          });

          if (!response.ok) throw new Error('No se pudo desactivar el becario');

          cargarBecarios();
          setAlert({ type: 'exito', title: 'Desactivado', message: 'Becario quitado correctamente' });

        } catch (err) {
          setAlert({ type: 'error', title: 'Error', message: err.message });
        }
      }
    });
  };

  const handleFormSubmit = (formData) => {
    if (modalConfig.mode === 'crear') handleCrearBecario(formData);
    if (modalConfig.mode === 'editar') handleEditarBecario(formData);
  };

  if (loading) return <p>Cargando becarios...</p>;
  if (error) return <div><p>Error: {error}</p><button onClick={cargarBecarios}>Reintentar</button></div>;
  if (!necesitaTabla(usuario.role)) return <p>No tienes permisos para ver becarios</p>;

  return (
    <div className="becarios-page">

      <div className="becarios-header">
        <h1 className="becarios-title">Gestión de Becarios</h1>
      </div>

      <div className="becarios-toolbar">
        {permisos.buscar && (
          <BecariosSearch
            value={searchTerm}
            onChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
          />
        )}
        {permisos.crear && (
          <button className="btn-crear-becario" onClick={() => abrirModal('crear')}>
            <img src={AgregarIcon} alt="Nuevo Becario" />
          </button>
        )}
      </div>

      {esAdministrador(usuario.role)
        ? <BecariosTableAdmin
            becarios={becariosPaginados}
            onVer={(b) => abrirModal('ver', b)}
            onEditar={permisos.editar ? (b) => abrirModal('editar', b) : null}
            onEliminar={permisos.eliminar ? handleEliminarBecario : null}
          />
        : <BecariosTable
            becarios={becariosPaginados}
            onVer={(b) => abrirModal('ver', b)}
            onEditar={permisos.editar ? (b) => abrirModal('editar', b) : null}
            onEliminar={permisos.eliminar ? handleEliminarBecario : null}
          />
      }

      {totalPages > 1 && (
        <BecariosPaginacion
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
            modalConfig.mode === 'crear' ? 'Nuevo Becario' :
            modalConfig.mode === 'editar' ? 'Editar Becario' :
            'Detalle del Becario'
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
            tipoPersona="Becario"
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

export default BecariosPage;