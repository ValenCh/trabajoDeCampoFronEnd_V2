import React, { useState, useEffect } from 'react';

// Componentes de la tabla
import GroupsSearch from '../components/Grupos/GruposSearch';
import GroupsTable from '../components/Grupos/GruposTable';
import GroupsPagination from '../components/Grupos/GruposPaginacion';
import GrupoForm from '../components/Grupos/GrupoForm';
import '../components/Grupos/Grupos.css';

// Sistema de modales existente
import { Modal, CuerpoModalInfo } from '../components/Modal';

// Sistema de alertas existente
import Alerta from '../components/Alertas/Alertas';

// Assets existentes
import AgregarGrupo from '../assets/agregarGrupo.png';

// ─── Constantes ───────────────────────────────────────────────────────────────
const GRUPOS_POR_PAGINA = 6;
const ENDPOINT_BASE = 'http://localhost:8081/AdministracionController/grupos';

// ─── Helper: headers con JWT ──────────────────────────────────────────────────
const getAuthHeaders = (extraHeaders = {}) => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${usuario.token}`,
    ...extraHeaders,
  };
};

// ─── Componente de información del grupo (modal Ver) ─────────────────────────
const InfoGrupo = ({ grupo }) => (
  <div className="grupo-info-grid">
    <div className="grupo-info-item">
      <span className="grupo-info-label">Nº Grupo</span>
      <span className="grupo-info-value">{grupo.oidGrupo}</span>
    </div>
    <div className="grupo-info-item">
      <span className="grupo-info-label">Sigla Facultad</span>
      <span className="grupo-info-value">{grupo.sigla || '—'}</span>
    </div>
    <div className="grupo-info-item full-width">
      <span className="grupo-info-label">Nombre</span>
      <span className="grupo-info-value">{grupo.nombreGrupo}</span>
    </div>
    <div className="grupo-info-item full-width">
      <span className="grupo-info-label">Email</span>
      <span className="grupo-info-value">{grupo.email || '—'}</span>
    </div>
    <div className="grupo-info-item">
      <span className="grupo-info-label">Director</span>
      <span className="grupo-info-value">{grupo.director || 'No asignado'}</span>
    </div>
    <div className="grupo-info-item">
      <span className="grupo-info-label">Vice-Director</span>
      <span className="grupo-info-value">{grupo.viceDirector || 'No asignado'}</span>
    </div>
    {grupo.objetivos && (
      <div className="grupo-info-item full-width">
        <span className="grupo-info-label">Objetivos</span>
        <span className="grupo-info-value" style={{ whiteSpace: 'pre-wrap' }}>
          {grupo.objetivos}
        </span>
      </div>
    )}
    {grupo.organigrama && (
      <div className="grupo-info-item full-width">
        <span className="grupo-info-label">Organigrama</span>
        <span className="grupo-info-value">{grupo.organigrama}</span>
      </div>
    )}
  </div>
);

// ─── Página principal ─────────────────────────────────────────────────────────
const GroupsPage = () => {
  // ── Estado de datos ──
  const [grupos, setGrupos]   = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Estado de búsqueda y paginación ──
  const [busqueda, setBusqueda]       = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Estado de alertas ──
  const [alert, setAlert] = useState(null);

  // ── Estado de modales ──
  const [modalVer, setModalVer]       = useState(null);   // grupo para ver
  const [modalEditar, setModalEditar] = useState(null);   // grupo para editar
  const [modalCrear, setModalCrear]   = useState(false);  // abrir/cerrar crear
  const [grupoAEliminar, setGrupoAEliminar] = useState(null); // id en espera

  // ─── Fetch inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ENDPOINT_BASE}/listarGrupos`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error HTTP ${response.status}`);
      }
      const data = await response.json();
      setGrupos(data);
    } catch (error) {
      setAlert({
        type: 'advertencia',
        title: 'Error al cargar grupos',
        message: error.message || 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Filtrado local ───────────────────────────────────────────────────────
  const gruposFiltrados = grupos.filter((g) => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return true;
    const coincideId     = String(g.oidGrupo).includes(texto);
    const coincideNombre = g.nombreGrupo?.toLowerCase().includes(texto);
    return coincideId || coincideNombre;
  });

  const handleBusqueda = (valor) => {
    setBusqueda(valor);
    setCurrentPage(1);
  };

  // ─── Paginación ───────────────────────────────────────────────────────────
  const totalPages    = Math.ceil(gruposFiltrados.length / GRUPOS_POR_PAGINA);
  const indexInicio   = (currentPage - 1) * GRUPOS_POR_PAGINA;
  const gruposPagina  = gruposFiltrados.slice(indexInicio, indexInicio + GRUPOS_POR_PAGINA);

  // ─── Acciones ────────────────────────────────────────────────────────────
  const handleVer     = (grupo) => setModalVer(grupo);
  const handleEditar  = (grupo) => setModalEditar(grupo);

  const handleEliminar = (oidGrupo) => {
    setGrupoAEliminar(oidGrupo);
    setAlert({
      type: 'advertencia',
      title: 'Eliminar grupo',
      message: '¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer.',
    });
  };

  const confirmarEliminar = async () => {
    setAlert(null);
    if (!grupoAEliminar) return;
    try {
      const response = await fetch(
        `${ENDPOINT_BASE}/eliminarGrupo/${grupoAEliminar}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error HTTP ${response.status}`);
      }
      setGrupos((prev) => prev.filter((g) => g.oidGrupo !== grupoAEliminar));
      setAlert({ type: 'exito', title: 'Grupo eliminado', message: 'El grupo fue eliminado correctamente.' });
    } catch (error) {
      setAlert({ type: 'error', title: 'Error al eliminar', message: error.message || 'Error desconocido' });
    } finally {
      setGrupoAEliminar(null);
    }
  };

  // ─── Submit: Crear ────────────────────────────────────────────────────────
  const handleCrear = async (formData) => {
    try {
      const response = await fetch(`${ENDPOINT_BASE}/crearGrupo`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error HTTP ${response.status}`);
      }
      setModalCrear(false);
      await fetchGrupos();
      setAlert({ type: 'exito', title: 'Grupo creado', message: 'El grupo fue creado correctamente.' });
    } catch (error) {
      setAlert({ type: 'error', title: 'Error al crear grupo', message: error.message || 'Error desconocido' });
    }
  };

  // ─── Submit: Editar ───────────────────────────────────────────────────────
  const handleGuardarEdicion = async (formData) => {
    try {
      const response = await fetch(
        `${ENDPOINT_BASE}/editarGrupo/${modalEditar.oidGrupo}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error HTTP ${response.status}`);
      }
      setModalEditar(null);
      setGrupos((prev) =>
        prev.map((g) =>
          g.oidGrupo === modalEditar.oidGrupo ? { ...g, ...formData } : g
        )
      );
      setAlert({ type: 'exito', title: 'Grupo actualizado', message: 'Los cambios fueron guardados correctamente.' });
    } catch (error) {
      setAlert({ type: 'error', title: 'Error al editar grupo', message: error.message || 'Error desconocido' });
    }
  };

  // ─── Disparar submit del form desde el botón del Modal ───────────────────
  const dispararSubmit = (formId) => {
    document
      .getElementById(formId)
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="groups-page">
        <div className="groups-loading">Cargando grupos...</div>
      </div>
    );
  }

  return (
    <div className="groups-page">

      {/* ── Header ── */}
      <header className="groups-header">
        <h1 className="groups-title">Grupos</h1>
        <button
          className="btn-add-group"
          title="Agregar nuevo grupo"
          onClick={() => setModalCrear(true)}
        >
          <img src={AgregarGrupo} alt="Agregar grupo" />
        </button>
      </header>

      {/* ── Búsqueda ── */}
      <GroupsSearch value={busqueda} onChange={handleBusqueda} />

      {/* ── Tabla ── */}
      <GroupsTable
        grupos={gruposPagina}
        onVer={handleVer}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />

      {/* ── Paginación ── */}
      <GroupsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* ══════════════════════════════════════════
          MODALES
      ══════════════════════════════════════════ */}

      {/* Modal: Ver información */}
      {modalVer && (
        <Modal
          title={`Grupo ${modalVer.oidGrupo} — ${modalVer.nombreGrupo}`}
          onClose={() => setModalVer(null)}
          onConfirm={() => setModalVer(null)}
          confirmText="Cerrar"
          showCancel={false}
          size="medium"
        >
          <CuerpoModalInfo
            type="custom"
            content={<InfoGrupo grupo={modalVer} />}
          />
        </Modal>
      )}

      {/* Modal: Crear grupo */}
      {modalCrear && (
        <Modal
          title="Agregar Grupo"
          onClose={() => setModalCrear(false)}
          onConfirm={() => dispararSubmit('form-crear-grupo')}
          confirmText="Crear"
          showCancel
          cancelText="Cancelar"
          size="large"
        >
          <GrupoForm
            formId="form-crear-grupo"
            onSubmit={handleCrear}
          />
        </Modal>
      )}

      {/* Modal: Editar grupo */}
      {modalEditar && (
        <Modal
          title={`Editar — ${modalEditar.nombreGrupo}`}
          onClose={() => setModalEditar(null)}
          onConfirm={() => dispararSubmit('form-editar-grupo')}
          confirmText="Guardar"
          showCancel
          cancelText="Cancelar"
          size="large"
        >
          <GrupoForm
            formId="form-editar-grupo"
            initialData={modalEditar}
            onSubmit={handleGuardarEdicion}
            showComparison
          />
        </Modal>
      )}

      {/* ══════════════════════════════════════════
          ALERTAS
      ══════════════════════════════════════════ */}
      {alert && (
        <Alerta
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => {
            setAlert(null);
            setGrupoAEliminar(null);
          }}
          onCancel={
            grupoAEliminar
              ? () => { setAlert(null); setGrupoAEliminar(null); }
              : undefined
          }
          onAccept={
            grupoAEliminar
              ? confirmarEliminar
              : () => setAlert(null)
          }
        />
      )}

    </div>
  );
};

export default GroupsPage;