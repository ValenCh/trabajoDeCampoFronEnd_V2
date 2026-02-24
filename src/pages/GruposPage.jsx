import React, { useState, useEffect, useCallback } from 'react';
import GruposSearch from '../components/Grupos/GruposSearch';
import GruposPaginacion from '../components/Grupos/GruposPaginacion';
import GruposTable from '../components/Grupos/GruposTable';
import GrupoForm from '../components/Grupos/GrupoForm';
import Modal from '../components/Modal/Modal';
import Alertas from '../components/Alertas/Alertas';
import { 
  obtenerEndpointsGrupos, 
  obtenerPermisos, 
  obtenerUsuario,
  construirHeaders,
  esAdministrador,
  necesitaTabla
} from '../config/permissions';
import '../components/Grupos/Grupos.css';
import AgregarGrupo from '../assets/agregarGrupo.png';

const GruposPage = () => {

  const usuario = obtenerUsuario();
  const permisos = obtenerPermisos(usuario.role);
  const endpoints = obtenerEndpointsGrupos(usuario.role);
  
  const [grupos, setGrupos] = useState([]);
  const [grupoUnico, setGrupoUnico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPorPagina = 6;
  
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: null,
    grupo: null
  });

  // =========================
  // CARGAR GRUPOS
  // =========================

  const cargarGrupos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = permisos.verTodos ? endpoints.LISTAR : endpoints.VER;

      const response = await fetch(url, {
        method: 'GET',
        headers: construirHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (permisos.verTodos) {
        setGrupos(Array.isArray(data) ? data : []);
        setTotalPages(Math.ceil((Array.isArray(data) ? data.length : 0) / itemsPorPagina));
      } else {
        setGrupoUnico(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [permisos, endpoints, itemsPorPagina]);

  useEffect(() => {
    cargarGrupos();
  }, [cargarGrupos]);

  // =========================
  // BÚSQUEDA Y PAGINACIÓN
  // =========================

  const gruposFiltrados = grupos.filter((grupo) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      grupo.nombreGrupo?.toLowerCase().includes(search) ||
      grupo.sigla?.toLowerCase().includes(search) ||
      String(grupo.oidGrupo).includes(searchTerm)
    );
  });

  const gruposPaginados = gruposFiltrados.slice(
    (currentPage - 1) * itemsPorPagina,
    currentPage * itemsPorPagina
  );

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // =========================
  // MODALES
  // =========================

  const abrirModal = (mode, grupo = null) => {
    setModalConfig({ isOpen: true, mode, grupo });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, mode: null, grupo: null });
  };

  // =========================
  // ACCIONES CRUD
  // =========================

  const handleVer = (grupo) => {
    abrirModal('ver', grupo);
  };

  const handleEditar = (grupo) => {
    if (!permisos.editar) {
      setAlert({ type: 'error', title: 'Sin permisos', message: 'No tienes permisos para editar grupos' });
      return;
    }
    abrirModal('editar', grupo);
  };

  const handleEliminar = (oidGrupo) => {
    if (!permisos.eliminar) {
      setAlert({ type: 'error', title: 'Sin permisos', message: 'No tienes permisos para eliminar grupos' });
      return;
    }

    setAlert({
      type: 'advertencia',
      title: 'Eliminar grupo',
      message: '¿Estás seguro de eliminar este grupo?',
      onAccept: async () => {
        try {
          const url = typeof endpoints.ELIMINAR === 'function'
            ? endpoints.ELIMINAR(oidGrupo)
            : `${endpoints.ELIMINAR}/${oidGrupo}`;

          const response = await fetch(url, {
            method: 'DELETE',
            headers: construirHeaders()
          });

          if (!response.ok) throw new Error(`Error al eliminar: ${response.status}`);

          cargarGrupos();
          setAlert({ type: 'exito', title: 'Eliminado', message: 'Grupo eliminado correctamente' });

        } catch (err) {
          setAlert({ type: 'error', title: 'Error', message: err.message });
        }
      }
    });
  };

  const handleCrearGrupo = async (formData) => {
    try {
      const response = await fetch(endpoints.CREAR, {
        method: 'POST',
        headers: construirHeaders(),
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      cerrarModal();
      cargarGrupos();
      setAlert({ type: 'exito', title: 'Creado', message: 'Grupo creado correctamente' });

    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleActualizarGrupo = async (formData) => {
    try {
      const url = typeof endpoints.ACTUALIZAR === 'function'
        ? endpoints.ACTUALIZAR(modalConfig.grupo.oidGrupo)
        : `${endpoints.ACTUALIZAR}/${modalConfig.grupo.oidGrupo}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: construirHeaders(),
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      cerrarModal();
      cargarGrupos();
      setAlert({ type: 'exito', title: 'Actualizado', message: 'Grupo actualizado correctamente' });

    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleFormSubmit = (formData) => {
    if (modalConfig.mode === 'crear') handleCrearGrupo(formData);
    else if (modalConfig.mode === 'editar') handleActualizarGrupo(formData);
  };

  // =========================
  // MODAL CONFIG
  // =========================

  const getModalTitle = () => {
    switch (modalConfig.mode) {
      case 'ver': return 'Información del Grupo';
      case 'crear': return 'Crear Nuevo Grupo';
      case 'editar': return 'Editar Grupo';
      default: return '';
    }
  };

  const getModalButtons = () => {
    if (modalConfig.mode === 'ver') {
      return [{ label: 'Cerrar', onClick: cerrarModal, variant: 'secondary' }];
    }
    return [
      { label: 'Cancelar', onClick: cerrarModal, variant: 'secondary' },
      {
        label: modalConfig.mode === 'crear' ? 'Crear' : 'Guardar',
        type: 'submit',
        formId: 'grupo-form-modal',
        variant: 'primary'
      }
    ];
  };

  // =========================
  // GUARDS
  // =========================

  if (loading) {
    return (
      <div className="grupos-page">
        <div className="grupos-loading">
          <i className="fa-solid fa-spinner fa-spin" />
          <p>Cargando grupos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grupos-page">
        <div className="grupos-error">
          <i className="fa-solid fa-circle-exclamation" />
          <h3>Error al cargar grupos</h3>
          <p>{error}</p>
          <button onClick={cargarGrupos} className="btn-retry">Reintentar</button>
        </div>
      </div>
    );
  }

  // Vista no administradores
  if (!permisos.verTodos) {
    return (
      <div className="grupo-detalle-page">
        <div className="grupos-header">
          <h1 className='grupos-title'>Mi Grupo</h1>
        </div>

        <div className="grupo-detalle-wrapper">
          {grupoUnico ? (
            <div className="grupo-detalle-container">
              <div className="grupo-detalle-header">
                <h2>{grupoUnico.nombreGrupo}</h2>
                <span className="grupo-sigla-badge">{grupoUnico.sigla}</span>
              </div>
              <div className="grupo-section">
                <div className='grupo-grid'>
                  <div className="grupo-field">
                    <span className="field-label">Email</span>
                    <span className="field-value">{grupoUnico.email}</span>
                  </div>
                  <div className="grupo-field">
                    <span className="field-label">Facultad Regional</span>
                    <span className="field-value">{grupoUnico.facultadRegional}</span>
                  </div>
                  <div className="grupo-section">
                    <span className="section-title">Objetivo y Desarrollo</span>
                    <p className="section-text">{grupoUnico.objetivoYDesarollo}</p>
                  </div>
                  <div className="grupo-section">
                    <span className="section-title">Organigrama</span>
                    <p className="section-text">{grupoUnico.organigrama}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grupo-no-asignado">
              <i className="fa-solid fa-users-slash" />
              <p>No tienes un grupo asignado</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista administradores
  return (
    <div className="grupos-page">
      <div className="grupos-header grupos-header-gestion">
        <h1 className='grupos-title'>Gestión de Grupos</h1>
      </div>
      
      <div className="grupos-toolbar">
        {permisos.buscar && (
          <GruposSearch value={searchTerm} onChange={handleSearchChange} />
        )}
        {permisos.crear && (
          <button className="btn-crear-grupo" onClick={() => abrirModal('crear')}>
            <img src={AgregarGrupo} className='btn-add-group' alt="Nuevo Grupo" />
          </button>
        )}
      </div>
      

      <GruposTable
        grupos={gruposPaginados}
        onVer={handleVer}
        onEditar={permisos.editar ? handleEditar : null}
        onEliminar={permisos.eliminar ? handleEliminar : null}
      />

      {permisos.paginar && totalPages > 1 && (
        <GruposPaginacion
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={cerrarModal}
        title={getModalTitle()}
        buttons={getModalButtons()}
        size={modalConfig.mode === 'ver' ? 'medium' : 'large'}
      >
        <GrupoForm
          initialData={modalConfig.grupo || {}}
          onSubmit={handleFormSubmit}
          formId="grupo-form-modal"
          disabled={modalConfig.mode === 'ver' ? {
            nombreGrupo: true,
            sigla: true,
            email: true,
            director: true,
            viceDirector: true,
            objetivos: true,
            organigrama: true
          } : {}}
          showComparison={modalConfig.mode === 'editar'}
        />
      </Modal>

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

export default GruposPage;