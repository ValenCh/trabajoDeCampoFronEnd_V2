import React, { useState, useEffect, useCallback } from 'react';
import PersonalTable from '../components/Personal/PersonalTable';
import PersonalSearch from '../components/Personal/PersonalSearch';
import PersonalPaginacion from '../components/Personal/PersonalPaginacion';
import Modal from '../components/Modal/Modal';
import PersonaForm from '../components/Personas/PersonaForm';

import {
  obtenerUsuario,
  construirHeaders,
  necesitaTabla,
  obtenerEndpointsPersonal,
  obtenerPermisosPersonal,
  obtenerEndpointsGrupos,
  esAdministrador,
  esDirector,
  esViceDirector,
} from '../config/permissions';

import '../components/Personal/Personal.css';
import AgregarIcon from '../assets/agregarEquipo.png';

const PersonalPage = () => {

  const itemsPorPagina = 10;
  const usuario = obtenerUsuario();
  const permisos = obtenerPermisosPersonal(usuario.role);
  const endpoints = obtenerEndpointsPersonal(usuario.role);
  const endpointsGrupos = obtenerEndpointsGrupos(usuario.role);

  const [personal, setPersonal] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: null,
    persona: null
  });

  // ═══════════════════════════════════════════════════════════════════════
  // CARGA BACKEND
  // ═══════════════════════════════════════════════════════════════════════

  const cargarPersonal = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.LISTAR, {
        method: 'GET',
        headers: construirHeaders()
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      setPersonal(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error('❌ Error al cargar personal:', err);
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
    cargarPersonal();
    cargarGrupos();
  }, [cargarPersonal, cargarGrupos]);

  // ═══════════════════════════════════════════════════════════════════════
  // FILTRO + PAGINACIÓN
  // ═══════════════════════════════════════════════════════════════════════

  const personalFiltrado = personal.filter(p => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(s) ||
      p.apellido?.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(personalFiltrado.length / itemsPorPagina);

  const personalPaginado = personalFiltrado.slice(
    (currentPage - 1) * itemsPorPagina,
    currentPage * itemsPorPagina
  );

  // ═══════════════════════════════════════════════════════════════════════
  // MODAL
  // ═══════════════════════════════════════════════════════════════════════

  const abrirModal = (mode, persona = null) => {
    setModalConfig({ isOpen: true, mode, persona });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, mode: null, persona: null });
  };

  // ═══════════════════════════════════════════════════════════════════════
  // CRUD
  // ═══════════════════════════════════════════════════════════════════════

  const handleCrearPersonal = async (formData) => {

  if (esAdministrador(usuario.role) && !formData.oidGrupo) {
    alert("Debe seleccionar un grupo");
    return;
  }

  const payload = {
    nombre: formData.nombre,
    apellido: formData.apellido,
    horasSemanales: Number(formData.horasSemanales),
    tipoPersona: "Personal",
    tipoPersonal: formData.tipoPersonal,
    categoriaUTN: formData.categoriaUTN,
  };

  try {
    const url = esAdministrador(usuario.role)
      ? endpoints.CREAR(formData.oidGrupo)
      : endpoints.CREAR;

    const response = await fetch(url, {
      method: "POST",
      headers: construirHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(await response.text());

    alert("Personal creado correctamente");
    cerrarModal();
    cargarPersonal();

  } catch (error) {
    console.error("❌ Error:", error);
    alert(error.message);
  }
};


  const handleEditarPersonal = async (formData) => {

    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      horasSemanales: Number(formData.horasSemanales),
      tipoPersona: "Personal",
      tipoPersonal: formData.tipoPersonal || null,
      categoriaUTN: formData.categoriaUTN || null,
    };

    try {
      const response = await fetch(
        endpoints.ACTUALIZAR(modalConfig.persona.oidPersona),
        {
          method: "PUT",
          headers: construirHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      alert("Personal actualizado correctamente");
      cerrarModal();
      cargarPersonal();

    } catch (error) {
      console.error("❌ Error:", error);
      alert(error.message);
    }
  };




  const handleEliminarPersonal = async (id) => {

  if (!window.confirm('¿Seguro que desea desactivar este personal?')) return;

  try {
    const response = await fetch(
      endpoints.ELIMINAR(id),
      {
        method: 'PUT',
        headers: construirHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    alert('Personal desactivado correctamente');
    cargarPersonal();

  } catch (error) {
    console.error('❌ Error:', error);
    alert(error.message);
  }
};

  

  const handleFormSubmit = (formData) => {
    if (modalConfig.mode === 'crear') handleCrearPersonal(formData);
    if (modalConfig.mode === 'editar') handleEditarPersonal(formData);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  if (loading) return <p>Cargando personal...</p>;

  if (error) return (
    <div>
      <p>Error: {error}</p>
      <button onClick={cargarPersonal}>Reintentar</button>
    </div>
  );

  if (!necesitaTabla(usuario.role)) {
    return <p>No tienes permisos para ver personal</p>;
  }

  return (
    <div className="personal-page">

      <div className="personal-header">
        <h1 className="personal-title">Gestión de Personal</h1>
      </div>

      <div className="personal-toolbar">

        {permisos.buscar && (
          <PersonalSearch
            value={searchTerm}
            onChange={(v) => {
              setSearchTerm(v);
              setCurrentPage(1);
            }}
          />
        )}

        {permisos.crear && (
          <button
            className="btn-crear-personal"
            onClick={() => abrirModal('crear')}
          >
            <img src={AgregarIcon} alt="Nuevo Personal" />
          </button>
        )}

      </div>

      <PersonalTable
        personal={personalPaginado}
        onVer={(p) => abrirModal('ver', p)}
        onEditar={permisos.editar ? (p) => abrirModal('editar', p) : null}
        onEliminar={permisos.eliminar ? handleEliminarPersonal : null}
      />

      {totalPages > 1 && (
        <PersonalPaginacion
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
    modalConfig.mode === 'crear' ? 'Nuevo Personal' :
    modalConfig.mode === 'editar' ? 'Editar Personal' :
    'Detalle del Personal'
  }
  buttons={
    modalConfig.mode === 'ver'
      ? [
          { label: 'Cerrar', onClick: cerrarModal, variant: 'secondary' }
        ]
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
            tipoPersona="Personal"
            modo={modalConfig.mode}
            onSubmit={handleFormSubmit}
            grupos={grupos}
          />
        </Modal>
      )}

    </div>
  );
};

export default PersonalPage;