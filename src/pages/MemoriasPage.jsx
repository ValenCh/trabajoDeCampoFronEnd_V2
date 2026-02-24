import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import MemoriasTable from '../components/Memorias/MemoriasTable';
import MemoriasSearch from '../components/Memorias/MemoriasSearch';
import MemoriasPaginacion from '../components/Memorias/MemoriasPaginacion';
import MemoriaForm from '../components/Memorias/MemoriaForm';
import Modal from '../components/Modal/Modal';
import MemoriasTableAdmin from '../components/Memorias/MemoriasTableAdmin';
import Alertas from '../components/Alertas/Alertas';

import {
  obtenerUsuario,
  construirHeaders,
  necesitaTabla,
  obtenerEndpointsGrupos,
  obtenerEndpointsMemorias,
  obtenerPermisosMemorias,
  esAdministrador,
} from '../config/permissions';

import '../components/Memorias/Memorias.css';
import AgregarIcon from '../assets/agregarEquipo.png';

const MemoriaPage = () => {

  const usuario = obtenerUsuario();
  const permisos = obtenerPermisosMemorias(usuario.role);
  const endpoints = obtenerEndpointsMemorias(usuario.role);
  const endpointsGrupos = obtenerEndpointsGrupos(usuario.role);
  const navigate = useNavigate();

  const [memorias, setMemorias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPorPagina = 10;

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: null,
  });

  // =========================
  // CARGA BACKEND
  // =========================
  const cargarMemorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoints.LISTAR, {
        headers: construirHeaders()
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setMemorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoints]);

  const cargarGrupos = useCallback(async () => {
    if (!esAdministrador(usuario.role)) return;
    try {
      const response = await fetch(endpointsGrupos.LISTAR, {
        headers: construirHeaders()
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setGrupos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error grupos:', err.message);
    }
  }, [usuario.role, endpointsGrupos]);

  useEffect(() => {
    cargarMemorias();
    cargarGrupos();
  }, [cargarMemorias, cargarGrupos]);

  // =========================
  // FILTRO + PAGINACIÓN
  // =========================
  const memoriasFiltradas = memorias.filter(m => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      String(m.anio).includes(s) ||
      m.grupo?.sigla?.toLowerCase().includes(s) ||
      m.grupo?.nombre?.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(memoriasFiltradas.length / itemsPorPagina);

  const memoriasPaginadas = memoriasFiltradas.slice(
    (currentPage - 1) * itemsPorPagina,
    currentPage * itemsPorPagina
  );

  // =========================
  // MODALES
  // =========================
  const abrirModal = (mode) => {
    setModalConfig({ isOpen: true, mode });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, mode: null });
  };

  // =========================
  // CREAR
  // =========================
  const handleCrearMemoria = async (formData) => {
    try {
      if (esAdministrador(usuario.role) && !formData.oidGrupo) {
        setAlert({ type: 'error', title: 'Error', message: 'Debe seleccionar un grupo' });
        return;
      }

      const url = esAdministrador(usuario.role)
        ? endpoints.CREAR(formData.oidGrupo, formData.anio)
        : endpoints.CREAR(formData.anio);

      const response = await fetch(url, {
        method: 'POST',
        headers: construirHeaders(),
      });

      if (!response.ok) throw new Error(await response.text());

      cerrarModal();
      cargarMemorias();
      setAlert({ type: 'exito', title: 'Creada', message: 'Memoria creada correctamente' });

    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  // =========================
  // EXPORTAR
  // =========================
  const handleExportar = async (oidMemoria) => {
    try {
      const response = await fetch(endpoints.EXPORTAR(oidMemoria), {
        headers: { Authorization: construirHeaders().Authorization }
      });
      if (!response.ok) throw new Error('Error al exportar');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `memoria_${oidMemoria}.xlsx`;
      link.click();
    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  // =========================
  // NAVEGACIÓN
  // =========================
  const handleVerMemoria = (memoria) => {
    navigate(`/memorias/${memoria.oidMemoria}`);
  };

  const handleGestionarMemoria = (memoria) => {
    navigate(`/memorias/${memoria.oidMemoria}`, { state: { modo: 'editar' } });
  };

  // =========================
  // GUARDS
  // =========================
  if (loading) return <p>Cargando memorias...</p>;

  if (error) return (
    <div>
      <p>Error: {error}</p>
      <button onClick={cargarMemorias}>Reintentar</button>
    </div>
  );

  if (!necesitaTabla(usuario.role)) {
    return <p>No tenés permisos para ver memorias</p>;
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="memorias-page">

      <div className="memorias-header">
        <h1 className="memorias-title">Gestión de Memorias</h1>
      </div>

      <div className="memorias-toolbar">

        {permisos.buscar && (
          <MemoriasSearch
            value={searchTerm}
            onChange={(v) => {
              setSearchTerm(v);
              setCurrentPage(1);
            }}
          />
        )}

        {permisos.crear && (
          <button
            className="btn-crear-memoria"
            onClick={() => abrirModal('crear')}
            title="Nueva Memoria"
          >
            <img src={AgregarIcon} alt="Nueva Memoria" className="icono-agregar-memoria" />
          </button>
        )}

      </div>

      {esAdministrador(usuario.role)
        ? <MemoriasTableAdmin
            memorias={memoriasPaginadas}
            onExportar={handleExportar}
            permisos={permisos}
          />
        : <MemoriasTable
            memorias={memoriasPaginadas}
            onExportar={handleExportar}
            permisos={permisos}
          />
      }

      {totalPages > 1 && (
        <MemoriasPaginacion
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {modalConfig.isOpen && (
        <Modal
          isOpen={modalConfig.isOpen}
          onClose={cerrarModal}
          title="Nueva Memoria"
          buttons={[
            { label: 'Cancelar', onClick: cerrarModal, variant: 'secondary' },
            {
              label: 'Crear',
              type: 'submit',
              formId: 'memoriaForm',
              variant: 'primary'
            }
          ]}
        >
          <MemoriaForm
            formId="memoriaForm"
            onSubmit={handleCrearMemoria}
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

export default MemoriaPage;