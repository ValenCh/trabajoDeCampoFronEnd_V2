import React, { useState, useEffect, useCallback } from 'react';
import EquiposTable from '../components/Equipos/EquiposTable';
import EquiposSearch from '../components/Equipos/EquiposSearch';
import Modal from '../components/Modal/Modal';
import EquipoForm from '../components/Equipos/EquipoForm';
import EquiposPaginacion from '../components/Equipos/EquiposPaginacion';
import EquiposTableAdmin from '../components/Equipos/EquiposTableAdmin';
import Alertas from '../components/Alertas/Alertas';

import {
  obtenerUsuario,
  obtenerPermisosEquipos,
  obtenerEndpointsEquipos,
  obtenerEndpointsGrupos,
  construirHeaders,
  necesitaTabla,
  esAdministrador,
  esDirector,
  esViceDirector
} from '../config/permissions';

import '../components/Equipos/Equipos.css';
import AgregarEquipo from '../assets/agregarEquipo.png';

const EquiposPage = () => {

  const usuario = obtenerUsuario();
  const permisos = obtenerPermisosEquipos(usuario.role);
  const endpoints = obtenerEndpointsEquipos(usuario.role);
  const endpointsGrupos = obtenerEndpointsGrupos(usuario.role);

  const [equipos, setEquipos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPorPagina = 6;

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: null,
    equipo: null
  });

  const [alert, setAlert] = useState(null);

  // =========================
  // CARGAR EQUIPOS
  // =========================

  const cargarEquipos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.LISTAR, {
        headers: construirHeaders()
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      setEquipos(Array.isArray(data) ? data : []);

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

      const response = await fetch(url, {
        headers: construirHeaders()
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      setGrupos(Array.isArray(data) ? data : [data]);

    } catch (err) {
      console.error(err);
    }
  }, [endpointsGrupos]);

  useEffect(() => {
    cargarEquipos();
    cargarGrupos();
  }, [cargarEquipos, cargarGrupos]);

  // =========================
  // MODAL
  // =========================

  const abrirModal = (mode, equipo = null) => {
    setModalConfig({ isOpen: true, mode, equipo });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, mode: null, equipo: null });
  };

  // =========================
  // CREAR
  // =========================

  const handleCrearEquipo = async (formData) => {
    try {

      let url = endpoints.CREAR;

      if (esAdministrador(usuario.role)) {
        if (!formData.oidGrupo) {
          setAlert({
            type: 'error',
            title: 'Error',
            message: 'Debe seleccionar un grupo'
          });
          return;
        }
        url = `${url}/${formData.oidGrupo}`;
      }

      const { oidGrupo, ...equipoData } = formData;

      const response = await fetch(url, {
        method: 'POST',
        headers: construirHeaders(),
        body: JSON.stringify(equipoData)
      });

      if (!response.ok) throw new Error(await response.text());

      cerrarModal();
      cargarEquipos();

      setAlert({
        type: 'exito',
        title: 'Equipo creado',
        message: 'Equipo creado correctamente'
      });

    } catch (err) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: err.message
      });
    }
  };

  // =========================
  // EDITAR
  // =========================

  const handleEditarEquipo = async (formData) => {
    try {

      const url = endpoints.ACTUALIZAR(modalConfig.equipo.oidEquipo);

      const response = await fetch(url, {
        method: 'PUT',
        headers: construirHeaders(),
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(await response.text());

      cerrarModal();
      cargarEquipos();

      setAlert({
        type: 'exito',
        title: 'Actualizado',
        message: 'Equipo actualizado correctamente'
      });

    } catch (err) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: err.message
      });
    }
  };

  // =========================
  // ELIMINAR
  // =========================

  const handleEliminarEquipo = (id) => {

    setAlert({
      type: 'advertencia',
      title: 'Eliminar equipo',
      message: '¿Seguro que desea eliminar este equipo?',
      onAccept: async () => {
        try {

          let url;

          if (esAdministrador(usuario.role)) {
            url = endpoints.ELIMINAR(id);

            const response = await fetch(url, {
              method: 'DELETE',
              headers: construirHeaders()
            });

            if (!response.ok) throw new Error('No se pudo eliminar');

          } else if (esDirector(usuario.role) || esViceDirector(usuario.role)) {
            url = endpoints.QUITAR(id);

            const response = await fetch(url, {
              method: 'PUT',
              headers: construirHeaders()
            });

            if (!response.ok) throw new Error('No se pudo desactivar');
          }

          cargarEquipos();

          setAlert({
            type: 'exito',
            title: 'Operación exitosa',
            message: 'El equipo fue procesado correctamente'
          });

        } catch (err) {
          setAlert({
            type: 'error',
            title: 'Error',
            message: err.message
          });
        }
      }
    });
  };

  const handleFormSubmit = (formData) => {
    if (modalConfig.mode === 'crear') handleCrearEquipo(formData);
    if (modalConfig.mode === 'editar') handleEditarEquipo(formData);
  };

  // =========================
  // FILTRO Y PAGINACIÓN
  // =========================

  const equiposFiltrados = equipos.filter(e => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      e.denominacion?.toLowerCase().includes(s) ||
      String(e.oidEquipo).includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(equiposFiltrados.length / itemsPorPagina);

  const equiposPaginados = equiposFiltrados.slice(
    (currentPage - 1) * itemsPorPagina,
    currentPage * itemsPorPagina
  );

  if (loading) return <p>Cargando equipos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!necesitaTabla(usuario.role)) return <p>No tienes permisos</p>;

  return (
    <div className="equipos-page">

      <div className="equipos-header">
        <h1 className="equipos-title">Gestión de Equipos</h1>
      </div>

      <div className="equipos-toolbar">

        {permisos.buscar && (
          <EquiposSearch
            value={searchTerm}
            onChange={setSearchTerm}
          />
        )}

        {permisos.crear && (
          <button
            className="btn-add-equipo"
            onClick={() => abrirModal('crear')}
          >
            <img src={AgregarEquipo} alt="Nuevo Equipo" />
          </button>
        )}
      </div>

      {esAdministrador(usuario.role)
        ? <EquiposTableAdmin
            equipos={equiposPaginados}
            onVer={(e) => abrirModal('ver', e)}
            onEditar={permisos.editar ? (e) => abrirModal('editar', e) : null}
            onEliminar={permisos.eliminar ? handleEliminarEquipo : null}
          />
        : <EquiposTable
            equipos={equiposPaginados}
            onVer={(e) => abrirModal('ver', e)}
            onEditar={permisos.editar ? (e) => abrirModal('editar', e) : null}
            onEliminar={permisos.eliminar ? handleEliminarEquipo : null}
          />
      }

      {totalPages > 1 && (
        <EquiposPaginacion
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
            modalConfig.mode === 'crear' ? 'Nuevo Equipo'
            : modalConfig.mode === 'editar' ? 'Editar Equipo'
            : 'Detalle del Equipo'
          }
          buttons={
            modalConfig.mode === 'ver'
              ? [{ label: 'Cerrar', onClick: cerrarModal, variant: 'secondary' }]
              : [
                  { label: 'Cancelar', onClick: cerrarModal, variant: 'secondary' },
                  {
                    label: modalConfig.mode === 'crear' ? 'Crear' : 'Guardar',
                    type: 'submit',
                    formId: 'equipoForm',
                    variant: 'primary'
                  }
                ]
          }
        >
          <EquipoForm
            formId="equipoForm"
            initialData={modalConfig.equipo}
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
            else setAlert(null);
          }}
        />
      )}

    </div>
  );
};

export default EquiposPage;