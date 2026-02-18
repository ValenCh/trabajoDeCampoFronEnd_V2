import React, { useState, useEffect, useCallback } from 'react';
import GruposSearch from '../components/Grupos/GruposSearch';
import GruposPaginacion from '../components/Grupos/GruposPaginacion';
import GruposTable from '../components/Grupos/GruposTable';
import GrupoForm from '../components/Grupos/GrupoForm';
import Modal from '../components/Modal/Modal';
import { 
  obtenerEndpointsGrupos, 
  obtenerPermisos, 
  obtenerUsuario,
  construirHeaders,  // ✅ AGREGADO: Import crítico para JWT
  esAdministrador,
  necesitaTabla
} from '../config/permissions';
import '../components/Grupos/Grupos.css';
import AgregarGrupo from '../assets/agregarGrupo.png';

/**
 * GruposPage
 * 
 * Página principal de gestión de grupos con permisos por rol.
 * 
 * ✅ CORRECCIÓN APLICADA:
 * - Todas las peticiones fetch ahora incluyen construirHeaders()
 * - Esto agrega el token JWT en el header Authorization
 * - Soluciona el error 403 Forbidden
 */
const GruposPage = () => {
  // ═══════════════════════════════════════════════════════════════════════
  // ESTADO Y CONFIGURACIÓN
  // ═══════════════════════════════════════════════════════════════════════
  
  const usuario = obtenerUsuario();
  const permisos = obtenerPermisos(usuario.role);
  const endpoints = obtenerEndpointsGrupos(usuario.role);
  
  // Estado de datos
  const [grupos, setGrupos] = useState([]);
  const [grupoUnico, setGrupoUnico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPorPagina = 10;
  
  // Estado de modales
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: null, // 'ver' | 'crear' | 'editar'
    grupo: null
  });

  // ═══════════════════════════════════════════════════════════════════════
  // CARGA DE DATOS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * ✅ CORREGIDO: Ahora incluye construirHeaders() para autenticación JWT
   */
  const cargarGrupos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Determinar endpoint según permisos
      const url = permisos.verTodos 
        ? endpoints.LISTAR 
        : endpoints.VER;

      console.log('📡 Cargando grupos desde:', url);

      // ✅ CAMBIO CRÍTICO: Agregar headers con JWT
      const response = await fetch(url, {
        method: 'GET',
        headers: construirHeaders()  // ← ESTO FALTABA
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Datos recibidos:', data);
      
      if (permisos.verTodos) {
        setGrupos(Array.isArray(data) ? data : []);
        setTotalPages(Math.ceil((Array.isArray(data) ? data.length : 0) / itemsPorPagina));
      } else {
        setGrupoUnico(data);
      }
    } catch (err) {
      console.error('❌ Error al cargar grupos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [permisos, endpoints, itemsPorPagina]);

  useEffect(() => {
    cargarGrupos();
  }, [cargarGrupos]);

  // ═══════════════════════════════════════════════════════════════════════
  // BÚSQUEDA Y PAGINACIÓN
  // ═══════════════════════════════════════════════════════════════════════
  
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

  // ═══════════════════════════════════════════════════════════════════════
  // MODALES
  // ═══════════════════════════════════════════════════════════════════════
  
  const abrirModal = (mode, grupo = null) => {
    setModalConfig({ isOpen: true, mode, grupo });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, mode: null, grupo: null });
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ACCIONES CRUD
  // ═══════════════════════════════════════════════════════════════════════
  
  const handleVer = (grupo) => {
    abrirModal('ver', grupo);
  };

  const handleEditar = (grupo) => {
    if (!permisos.editar) {
      alert('No tienes permisos para editar grupos');
      return;
    }
    abrirModal('editar', grupo);
  };

  /**
   * ✅ CORREGIDO: Ahora incluye construirHeaders()
   */
  const handleEliminar = async (oidGrupo) => {
    if (!permisos.eliminar) {
      alert('No tienes permisos para eliminar grupos');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar este grupo?')) {
      return;
    }

    try {
      const url = typeof endpoints.ELIMINAR === 'function'
        ? endpoints.ELIMINAR(oidGrupo)
        : `${endpoints.ELIMINAR}/${oidGrupo}`;

      console.log('🗑️ Eliminando grupo:', url);

      // ✅ CAMBIO CRÍTICO: Agregar headers con JWT
      const response = await fetch(url, {
        method: 'DELETE',
        headers: construirHeaders()  // ← AGREGADO
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar: ${response.status}`);
      }

      alert('Grupo eliminado correctamente');
      cargarGrupos();
    } catch (err) {
      console.error('❌ Error al eliminar:', err);
      alert(`Error: ${err.message}`);
    }
  };

  /**
   * ✅ CORREGIDO: Ahora incluye construirHeaders()
   */
  const handleCrearGrupo = async (formData) => {
    try {
      console.log('➕ Creando grupo:', formData);

      // ✅ CAMBIO CRÍTICO: Agregar headers con JWT
      const response = await fetch(endpoints.CREAR, {
        method: 'POST',
        headers: construirHeaders(),  // ← AGREGADO
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      alert('Grupo creado correctamente');
      cerrarModal();
      cargarGrupos();
    } catch (err) {
      console.error('❌ Error al crear:', err);
      alert(`Error: ${err.message}`);
    }
  };

  /**
   * ✅ CORREGIDO: Ahora incluye construirHeaders()
   */
  const handleActualizarGrupo = async (formData) => {
    try {
      const url = typeof endpoints.ACTUALIZAR === 'function'
        ? endpoints.ACTUALIZAR(modalConfig.grupo.oidGrupo)
        : `${endpoints.ACTUALIZAR}/${modalConfig.grupo.oidGrupo}`;

      console.log('✏️ Actualizando grupo:', url, formData);

      // ✅ CAMBIO CRÍTICO: Agregar headers con JWT
      const response = await fetch(url, {
        method: 'PUT',
        headers: construirHeaders(),  // ← AGREGADO
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      alert('Grupo actualizado correctamente');
      cerrarModal();
      cargarGrupos();
    } catch (err) {
      console.error('❌ Error al actualizar:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleFormSubmit = (formData) => {
    if (modalConfig.mode === 'crear') {
      handleCrearGrupo(formData);
    } else if (modalConfig.mode === 'editar') {
      handleActualizarGrupo(formData);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // CONFIGURACIÓN DE MODALES
  // ═══════════════════════════════════════════════════════════════════════
  
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
      return [
        {
          label: 'Cerrar',
          onClick: cerrarModal,
          variant: 'secondary'
        }
      ];
    }
    
    return [
      {
        label: 'Cancelar',
        onClick: cerrarModal,
        variant: 'secondary'
      },
      {
        label: modalConfig.mode === 'crear' ? 'Crear' : 'Guardar',
        type: 'submit',
        formId: 'grupo-form-modal',
        variant: 'primary'
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDERIZADO
  // ═══════════════════════════════════════════════════════════════════════
  
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
          <button onClick={cargarGrupos} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Vista para usuarios NO administradores (solo ven su grupo)
if (!permisos.verTodos) {
  return (
    <div className="grupo-detalle-page">
      <div className="grupos-header">
        <h1>Mi Grupo</h1>
      </div>

      <div className="grupo-detalle-wrapper">
        {grupoUnico ? (
          <div className="grupo-detalle-container">
            <div className="grupo-detalle-header">
              <h2>{grupoUnico.nombreGrupo}</h2>
              <span className="grupo-sigla-badge">
                {grupoUnico.sigla}
              </span>
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
                <p className="section-text">
                  {grupoUnico.objetivoYDesarollo}
                </p>
              </div>

              <div className="grupo-section">
                <span className="section-title">Organigrama</span>
                <p className="section-text">
                  {grupoUnico.organigrama}
                </p>
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



  // Vista para ADMINISTRADORES (ven todos los grupos en tabla)
  return (
    <div className="grupos-page">
      <div className="grupos-header">
        <h1>Gestión de Grupos</h1>

<div className="equipos-toolbar">

      {permisos.buscar && (
        <GruposSearch 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      )}


        {permisos.crear && (
          <button 
            className="btn-crear-grupo"
            onClick={() => abrirModal('crear')}
          >
            <img src={AgregarGrupo} className='btn-add-group' alt="Nuevo Grupo" />
            
          </button>
        )}
      </div>
      

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

      {/* Modal unificado */}
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
    </div>
  );
};

export default GruposPage;