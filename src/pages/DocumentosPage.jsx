import React, { useState, useEffect, useCallback } from 'react';

import DocumentosTable from '../components/Documentos/DocumentosTable';
import DocumentosSearch from '../components/Documentos/DocumentosSearch';
import DocumentosPaginacion from '../components/Documentos/DocumentosPaginacion';
import DocumentoForm from '../components/Documentos/DocumentoForm';
import Modal from '../components/Modal/Modal';
import { obtenerEndpointsGrupos } from '../config/permissions';
import AgregarDocumento from '../assets/agregarDocumento.png';

import {
  obtenerUsuario,
  obtenerPermisosDocumentos,
  obtenerEndpointsDocumentos,
  construirHeaders,
  necesitaTabla,
  esAdministrador,
  esDirector,
  esViceDirector
} from '../config/permissions';

import '../components/Documentos/Documentos.css';

const DocumentosPage = () => {

  const usuario = obtenerUsuario();
  const permisos = obtenerPermisosDocumentos(usuario.role);
  const endpoints = obtenerEndpointsDocumentos(usuario.role);
  const endpointsGrupos = obtenerEndpointsGrupos(usuario.role);

  const [grupos, setGrupos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPorPagina = 10;

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: null,
    documento: null
  });

  // =========================
  // CARGAR GRUPOS (solo admin)
  // =========================
  const cargarGrupos = useCallback(async () => {

    if (usuario.role !== 'ADMINISTRADOR') return;

    try {
      const response = await fetch(endpointsGrupos.LISTAR, {
        headers: construirHeaders()
      });

      const data = await response.json();
      setGrupos(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("❌ Error grupos:", err);
    }

  }, [usuario.role, endpointsGrupos]);


  // =========================
  // CARGAR DOCUMENTOS
  // =========================
  const cargarDocumentos = useCallback(async () => {

    setLoading(true);

    try {
      const response = await fetch(endpoints.LISTAR, {
        headers: construirHeaders()
      });

      if (!response.ok) throw new Error("Error al cargar");

      const data = await response.json();
      setDocumentos(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("❌ Error documentos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

  }, [endpoints]);


  useEffect(() => {
    cargarDocumentos();
    cargarGrupos();
  }, [cargarDocumentos, cargarGrupos]);


  // =========================
  // FILTRO + PAGINACION
  // =========================
  const documentosFiltrados = documentos.filter(d => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      d.titulo?.toLowerCase().includes(s) ||
      d.editorial?.toLowerCase().includes(s) ||
      String(d.oidDocumento).includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(documentosFiltrados.length / itemsPorPagina);

  const documentosPaginados = documentosFiltrados.slice(
    (currentPage - 1) * itemsPorPagina,
    currentPage * itemsPorPagina
  );


  // =========================
  // MODALES
  // =========================
  const abrirModal = (mode, documento = null) => {
    setModalConfig({ isOpen: true, mode, documento });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, mode: null, documento: null });
  };


  // =========================
  // CREAR
  // =========================
  const handleCrearDocumento = async (formData) => {
  try {

    const usuario = obtenerUsuario();
    const esAdmin = usuario.role === 'ADMINISTRADOR';

    let url = endpoints.CREAR;

    if (esAdmin) {
      if (!formData.oidGrupo) {
        alert("Debe seleccionar un grupo");
        return;
      }
      url = endpoints.CREAR(formData.oidGrupo);
    }

    const { oidGrupo, ...documentoData } = formData;

    const data = new FormData();

    // DTO como JSON
    data.append(
      "documento",
      new Blob([JSON.stringify(documentoData)], {
        type: "application/json"
      })
    );

    // Archivo
    if (formData.archivo) {
      data.append("archivo", formData.archivo);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: construirHeaders().Authorization
      },
      body: data
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    alert("Documento creado correctamente");
    cerrarModal();
    cargarDocumentos();

  } catch (err) {
    alert(err.message);
  }
};


  // =========================
  // EDITAR
  // =========================
  const handleEditarDocumento = async (formData) => {
  try {

    const data = new FormData();

    // Enviamos el DTO como JSON
    data.append(
      "documento",
      new Blob([JSON.stringify(formData)], {
        type: "application/json"
      })
    );

    // Si hay archivo nuevo lo agregamos
    if (formData.archivo) {
      data.append("archivo", formData.archivo);
    }

    const response = await fetch(
      endpoints.ACTUALIZAR(modalConfig.documento.oidDocumento),
      {
        method: 'PUT',
        headers: {
          Authorization: construirHeaders().Authorization
          // ❌ NO pongas Content-Type
        },
        body: data
      }
    );

    if (!response.ok) throw new Error(await response.text());

    alert("Documento actualizado");
    cerrarModal();
    cargarDocumentos();

  } catch (err) {
    alert(err.message);
  }
};

  // =========================
  // ELIMINAR
  // =========================
  const handleEliminarDocumento = async (id) => {

    if (!window.confirm("¿Eliminar documento?")) return;

    try {

      let url;
      let method;

      if (esAdministrador(usuario.role)) {
        url = endpoints.ELIMINAR(id);
        method = 'DELETE';
      }
      else if (esDirector(usuario.role) || esViceDirector(usuario.role)) {
        url = endpoints.QUITAR(id);
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: construirHeaders()
      });

      if (!response.ok) throw new Error(await response.text());

      alert("Documento eliminado");
      cargarDocumentos();

    } catch (err) {
      alert(err.message);
    }
  };


  // =========================
  // DESCARGAR (cualquier formato)
  // =========================
  const handleDescargarDocumento = async (documento) => {

    try {

      if (!documento?.oidDocumento) {
        alert("Este documento no tiene archivo asociado");
        return;
      }

      const url = endpoints.DESCARGAR(documento.oidDocumento);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: construirHeaders().Authorization
        }
      });

      if (!response.ok) {
        throw new Error("Este documento no tiene archivo disponible");
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        alert("Este documento no tiene archivo cargado");
        return;
      }

        const disposition = response.headers.get("Content-Disposition");

        let fileName = `documento_${documento.titulo}`;

        if (disposition) {
          const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (match && match[1]) {
            fileName = match[1].replace(/['"]/g, '');
          }
}

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

    } catch (err) {
      alert(err.message || "No hay archivo para descargar");
    }
  };


  const handleFormSubmit = (formData) => {
    if (modalConfig.mode === 'crear') handleCrearDocumento(formData);
    if (modalConfig.mode === 'editar') handleEditarDocumento(formData);
  };


  if (loading) return <p>Cargando documentos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!necesitaTabla(usuario.role)) return <p>No tenés permisos</p>;


  return (
    <div className="documentos-page">

      <div className="documentos-header">
        <h1 className="documentos-title">Gestión de Documentos</h1>
      </div>

      <div className="documentos-toolbar">

        {permisos.buscar && (
          <DocumentosSearch
            value={searchTerm}
            onChange={setSearchTerm}
          />
        )}

        {permisos.crear && (
          <button
            className="btn-crear-documento"
            onClick={() => abrirModal('crear')}
            title="Nuevo Documento"
          >
            <img
              src={AgregarDocumento}
              alt="Nuevo Documento"
              className="icono-agregar-documento"
            />
          </button>
        )}

      </div>

      <DocumentosTable
        documentos={documentosPaginados}
        onVer={(d) => abrirModal('ver', d)}
        onEditar={permisos.editar ? (d) => abrirModal('editar', d) : null}
        onEliminar={permisos.eliminar ? handleEliminarDocumento : null}
        onDescargar={handleDescargarDocumento}
      />

      {totalPages > 1 && (
        <DocumentosPaginacion
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
      modalConfig.mode === 'crear'
        ? 'Nuevo Documento'
        : modalConfig.mode === 'editar'
        ? 'Editar Documento'
        : 'Detalle del Documento'
    }
    buttons={
      modalConfig.mode === 'ver'
        ? [
            {
              label: 'Cerrar',
              onClick: cerrarModal,
              variant: 'secondary'
            }
          ]
        : [
            {
              label: 'Cancelar',
              onClick: cerrarModal,
              variant: 'secondary'
            },
            {
              label:
                modalConfig.mode === 'crear'
                  ? 'Crear'
                  : 'Guardar',
              type: 'submit',
              formId: 'documentoForm',
              variant: 'primary'
            }
          ]
    }
  >
    <DocumentoForm
      formId="documentoForm"
      initialData={modalConfig.documento}
      onSubmit={handleFormSubmit}
      grupos={grupos}
      viewMode={modalConfig.mode === 'ver'}
    />
  </Modal>
)}

    </div>
  );
};

export default DocumentosPage;