import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import MemoriaDetalleHeader from '../components/MemoriasDetalle/MemoriaDetalleHeader';
import MemoriaDetalleTabs from '../components/MemoriasDetalle/MemoriaDetalleTabs';
import MemoriaDetalleSeccion from '../components/MemoriasDetalle/MemoriaDetalleSeccion';
import Alertas from '../components/Alertas/Alertas';

import {
  obtenerUsuario,
  construirHeaders,
  obtenerEndpointsMemorias,
  obtenerEndpointsBecarios,
  obtenerEndpointsInvestigadores,
  obtenerEndpointsIntegrantesCE,
  obtenerEndpointsPersonal,
  obtenerEndpointsEquipos,
  obtenerEndpointsDocumentos,
  obtenerPermisosMemorias,
} from '../config/permissions';

import '../components/MemoriasDetalle/MemoriaDetalle.css';

const COLUMNAS_PERSONAS = [
  { key: 'nombre',         label: 'Nombre' },
  { key: 'apellido',       label: 'Apellido' },
  { key: 'tipoPersona',    label: 'Tipo', render: (p) => p.tipoPersona || '-' },
  { key: 'horasSemanales', label: 'Horas' },
];

const COLUMNAS_EQUIPOS = [
  { key: 'denominacion', label: 'Denominación' },
  { key: 'descripcion',  label: 'Descripción' },
];

const COLUMNAS_DOCUMENTOS = [
  { key: 'titulo', label: 'Título' },
  { key: 'anio',   label: 'Año' },
];

const normalizarPersona = (persona, tipoPersona) => ({
  ...persona,
  oidPersona:
    persona.oidPersona
    || persona.oidBecario
    || persona.oidInvestigador
    || persona.oidIntegranteConsejoEducativo
    || persona.oidPersonal,
  tipoPersona
});

const MemoriaDetallePage = () => {

  const { oidMemoria } = useParams();
  const location       = useLocation();

  const usuario          = obtenerUsuario();
  const endpoints        = obtenerEndpointsMemorias(usuario.role);
  const endpointsEquipos = obtenerEndpointsEquipos(usuario.role);
  const endpointsDocs    = obtenerEndpointsDocumentos(usuario.role);
  const puedeGestionar   = location.state?.modo === 'editar';

  const [memoria,    setMemoria]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [alert,      setAlert]      = useState(null);
  const [activeTab,  setActiveTab]  = useState('personas');

  const [personasMemoria,    setPersonasMemoria]    = useState([]);
  const [equiposMemoria,     setEquiposMemoria]     = useState([]);
  const [documentosMemoria,  setDocumentosMemoria]  = useState([]);

  const [personasDisponibles,   setPersonasDisponibles]   = useState([]);
  const [equiposDisponibles,    setEquiposDisponibles]    = useState([]);
  const [documentosDisponibles, setDocumentosDisponibles] = useState([]);

  const get = useCallback(async (url) => {
    const r = await fetch(url, { headers: construirHeaders() });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }, []);

  const cargarMemoria = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMemoria(await get(endpoints.OBTENER(oidMemoria)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [oidMemoria, endpoints, get]);

  const cargarPersonasMemoria = useCallback(async () => {
    try { setPersonasMemoria(await get(endpoints.LISTAR_PERSONAS(oidMemoria))); }
    catch (err) { 
      setAlert({ type: 'error', title: 'Error', message: err.message }); 
    }
  }, [oidMemoria, endpoints, get]);

  const cargarEquiposMemoria = useCallback(async () => {
    try { setEquiposMemoria(await get(endpoints.LISTAR_EQUIPOS(oidMemoria))); }
    catch (err) { 
      setAlert({ type: 'error', title: 'Error', message: err.message }); 
    }
  }, [oidMemoria, endpoints, get]);

  const cargarDocumentosMemoria = useCallback(async () => {
    try { setDocumentosMemoria(await get(endpoints.LISTAR_DOCUMENTOS(oidMemoria))); }
    catch (err) { 
      setAlert({ type: 'error', title: 'Error', message: err.message }); 
    }
  }, [oidMemoria, endpoints, get]);

  const cargarDisponibles = useCallback(async () => {
    if (!puedeGestionar) return;
    try {
      const [becarios, investigadores, integrantesCE, personal, equipos, documentos] =
        await Promise.all([
          get(obtenerEndpointsBecarios(usuario.role).LISTAR).catch(() => []),
          get(obtenerEndpointsInvestigadores(usuario.role).LISTAR).catch(() => []),
          get(obtenerEndpointsIntegrantesCE(usuario.role).LISTAR).catch(() => []),
          get(obtenerEndpointsPersonal(usuario.role).LISTAR).catch(() => []),
          get(endpointsEquipos.LISTAR).catch(() => []),
          get(endpointsDocs.LISTAR).catch(() => []),
        ]);

      setPersonasDisponibles([
        ...becarios.map(p => normalizarPersona(p, 'Becario')),
        ...investigadores.map(p => normalizarPersona(p, 'Investigador')),
        ...integrantesCE.map(p => normalizarPersona(p, 'IntegranteConsejoEducativo')),
        ...personal.map(p => normalizarPersona(p, 'Personal')),
      ]);

      setEquiposDisponibles(Array.isArray(equipos) ? equipos : []);
      setDocumentosDisponibles(Array.isArray(documentos) ? documentos : []);
    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  }, [puedeGestionar, usuario.role, endpointsEquipos, endpointsDocs, get]);

  useEffect(() => {
    cargarMemoria();
    cargarPersonasMemoria();
    cargarEquiposMemoria();
    cargarDocumentosMemoria();
  }, [cargarMemoria, cargarPersonasMemoria, cargarEquiposMemoria, cargarDocumentosMemoria]);

  useEffect(() => {
    if (memoria) cargarDisponibles();
  }, [memoria, cargarDisponibles]);

  // ─── ACCIONES ────────────────────────────────────────────────────────────
  const accion = useCallback(async (url, method, onSuccess) => {
    try {
      const r = await fetch(url, { method, headers: construirHeaders() });
      if (!r.ok) throw new Error(await r.text());
      onSuccess();
    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  }, []);

  const handleAgregarPersona   = (id) => accion(endpoints.AGREGAR_PERSONA(oidMemoria, id),   'POST',   cargarPersonasMemoria);
  const handleAgregarEquipo    = (id) => accion(endpoints.AGREGAR_EQUIPO(oidMemoria, id),    'POST',   cargarEquiposMemoria);
  const handleAgregarDocumento = (id) => accion(endpoints.AGREGAR_DOCUMENTO(oidMemoria, id), 'POST',   cargarDocumentosMemoria);

  const handleQuitarPersona = (id) => {
    setAlert({
      type: 'advertencia',
      title: 'Quitar persona',
      message: '¿Quitar esta persona de la memoria?',
      onAccept: () => accion(endpoints.QUITAR_PERSONA(oidMemoria, id), 'DELETE', cargarPersonasMemoria)
    });
  };

  const handleQuitarEquipo = (id) => {
    setAlert({
      type: 'advertencia',
      title: 'Quitar equipo',
      message: '¿Quitar este equipo de la memoria?',
      onAccept: () => accion(endpoints.QUITAR_EQUIPO(oidMemoria, id), 'DELETE', cargarEquiposMemoria)
    });
  };

  const handleQuitarDocumento = (id) => {
    setAlert({
      type: 'advertencia',
      title: 'Quitar documento',
      message: '¿Quitar este documento de la memoria?',
      onAccept: () => accion(endpoints.QUITAR_DOCUMENTO(oidMemoria, id), 'DELETE', cargarDocumentosMemoria)
    });
  };

  const handleExportar = async () => {
    try {
      const r = await fetch(endpoints.EXPORTAR(oidMemoria), {
        headers: { Authorization: construirHeaders().Authorization }
      });
      if (!r.ok) throw new Error('Error al exportar');
      const blob = await r.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `memoria_${oidMemoria}.xlsx`;
      link.click();
    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    }
  };

  if (loading) return <p>Cargando memoria...</p>;
  if (error)   return <div><p>Error: {error}</p><button onClick={cargarMemoria}>Reintentar</button></div>;
  if (!memoria) return <p>Memoria no encontrada</p>;

  return (
    <div className="memoria-detalle-page">

      <MemoriaDetalleHeader
        memoria={memoria}
        onExportar={handleExportar}
      />

      <MemoriaDetalleTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        conteos={{
          personas:   personasMemoria.length,
          equipos:    equiposMemoria.length,
          documentos: documentosMemoria.length,
        }}
      />

      <div className="memoria-detalle-content">

        {activeTab === 'personas' && (
          <MemoriaDetalleSeccion
            columnas={COLUMNAS_PERSONAS}
            enMemoria={personasMemoria}
            disponibles={personasDisponibles}
            keyField="oidPersona"
            onAgregar={handleAgregarPersona}
            onQuitar={handleQuitarPersona}
            puedeGestionar={puedeGestionar}
            emptyMessage="Sin personas agregadas"
          />
        )}

        {activeTab === 'equipos' && (
          <MemoriaDetalleSeccion
            columnas={COLUMNAS_EQUIPOS}
            enMemoria={equiposMemoria}
            disponibles={equiposDisponibles}
            keyField="oidEquipo"
            onAgregar={handleAgregarEquipo}
            onQuitar={handleQuitarEquipo}
            puedeGestionar={puedeGestionar}
            emptyMessage="Sin equipos agregados"
          />
        )}

        {activeTab === 'documentos' && (
          <MemoriaDetalleSeccion
            columnas={COLUMNAS_DOCUMENTOS}
            enMemoria={documentosMemoria}
            disponibles={documentosDisponibles}
            keyField="oidDocumento"
            onAgregar={handleAgregarDocumento}
            onQuitar={handleQuitarDocumento}
            puedeGestionar={puedeGestionar}
            emptyMessage="Sin documentos agregados"
          />
        )}

      </div>

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

export default MemoriaDetallePage;