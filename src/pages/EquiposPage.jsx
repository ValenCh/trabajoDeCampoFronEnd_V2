import React, { useState, useEffect, useCallback } from 'react';
import EquiposTable from '../components/Equipos/EquiposTable';
import EquiposSearch from '../components/Equipos/EquiposSearch';
import Modal from '../components/Modal/Modal';               // ← 🔥 ESTE FALTABA
import EquipoForm from '../components/Equipos/EquipoForm';
import { obtenerEndpointsGrupos,esAdministrador,esDirector,esViceDirector,esIntegrante } from '../config/permissions';
import EquiposPaginacion from '../components/Equipos/EquiposPaginacion';

import {
  obtenerUsuario,
  obtenerPermisosEquipos,
  obtenerEndpointsEquipos,
  construirHeaders,
  necesitaTabla
} from '../config/permissions';

import '../components/Equipos/Equipos.css';

import AgregarEquipo from '../assets/agregarEquipo.png';


const EquiposPage = () => {
const [currentPage, setCurrentPage] = useState(1);
const itemsPorPagina = 10;
  const [grupos, setGrupos] = useState([]);


  const usuario = obtenerUsuario();
  const permisos = obtenerPermisosEquipos(usuario.role);
  const endpoints = obtenerEndpointsEquipos(usuario.role);
  const endpointsGrupos = obtenerEndpointsGrupos(usuario.role);
  

  // Estado de datos
  const [equipos, setEquipos] = useState([]);
  
  // Estado de búsqueda y paginación
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado de modales
const [modalConfig, setModalConfig] = useState({
  isOpen: false,
  mode: null,
  equipo: null
});



  // 🔹 CARGA REAL DESDE BACKEND
  const cargarEquipos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.LISTAR, {
        method: 'GET',
        headers: construirHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      setEquipos(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error('❌ Error al cargar equipos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

  }, [endpoints]);



const cargarGrupos = useCallback(async () => {
  try {

    const url = endpointsGrupos.LISTAR || endpointsGrupos.VER;

    console.log("📡 Grupos URL:", url);

    if (!url) {
      throw new Error("No hay endpoint de grupos para este rol");
    }

    const response = await fetch(url, {
      headers: construirHeaders()
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const text = await response.text();

    // Debug
    console.log("📦 Grupos RAW:", text);

    const data = JSON.parse(text);

    setGrupos(Array.isArray(data) ? data : [data]);

  } catch (err) {
    console.error("❌ Error grupos:", err.message);
  }

}, [endpointsGrupos]);

useEffect(() => {
  cargarEquipos();
  cargarGrupos();
}, [cargarEquipos, cargarGrupos]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };


    // ═══════════════════════════════════════════════════════════════════════
  // BÚSQUEDA Y PAGINACIÓN
  // ═══════════════════════════════════════════════════════════════════════
  

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

  if (error) return (
    <div>
      <p>Error: {error}</p>
      <button onClick={cargarEquipos}>Reintentar</button>
    </div>
  );

  if (!necesitaTabla(usuario.role)) {
    return <p>No tienes permisos para ver equipos</p>;
  }

    // ═══════════════════════════════════════════════════════════════════════
  // MODALES
  // ═══════════════════════════════════════════════════════════════════════
  const abrirModal = (mode, equipo = null) => {
  setModalConfig({ isOpen: true, mode, equipo });
};

const cerrarModal = () => {
  setModalConfig({ isOpen: false, mode: null, equipo: null });
};

const handleCrearEquipo = async (formData) => {
  try {
    const usuario = obtenerUsuario();
    const esAdmin = usuario.role === 'ADMINISTRADOR';

    // URL según rol
    let url = endpoints.CREAR; // Para director/vice: /equipos/agregarEquipo
    if (esAdmin) {
      if (!formData.oidGrupo) {
        alert("Debe seleccionar un grupo");
        return;
      }
      url = `${url}/${formData.oidGrupo}`; // Para admin: /equipos/agregarEquipo/{oidGrupo}
    }

    // Creamos objeto sin oidGrupo si no lo necesita el backend
    const { oidGrupo, ...equipoData } = formData;

    const response = await fetch(url, {
      method: 'POST',
      headers: construirHeaders(),
      body: JSON.stringify(equipoData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    alert('Equipo creado correctamente');
    cerrarModal();
    cargarEquipos();

  } catch (err) {
    console.error('❌ Error al crear equipo:', err);
    alert(err.message);
  }
};


const handleEditarEquipo = async (formData) => {
  try {

    const url = endpoints.ACTUALIZAR(modalConfig.equipo.oidEquipo);

    console.log("✏️ Editando equipo:", url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: construirHeaders(),
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    alert('Equipo actualizado');

    cerrarModal();
    cargarEquipos();

  } catch (err) {
    console.error('❌ Error:', err);
    alert(err.message);
  }
};


const handleEliminarEquipo = async (id) => {
  if (!window.confirm('¿Seguro que querés eliminar este equipo?')) return;

  try {
    const usuario = obtenerUsuario();
    let url;

    if (esAdministrador(usuario.role)) {
      // Admin → DELETE físico
      url = endpoints.ELIMINAR(id);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: construirHeaders()
      });

      if (!response.ok) throw new Error('No se pudo eliminar físicamente el equipo');

      alert('Equipo eliminado correctamente');

    } else if (esDirector(usuario.role) || esViceDirector(usuario.role)) {
      // Director / ViceDirector → Soft delete
      url = endpoints.QUITAR(id);
      const response = await fetch(url, {
        method: 'PUT', // Soft delete con PUT
        headers: construirHeaders()
      });

      if (!response.ok) throw new Error('No se pudo desactivar el equipo');

      alert('Equipo desactivado correctamente');
    }

    cargarEquipos();

  } catch (err) {
    console.error('❌ Error:', err);
    alert(err.message);
  }
};


const handleFormSubmit = (formData) => {

  if (modalConfig.mode === 'crear') {
    handleCrearEquipo(formData);
  }

  if (modalConfig.mode === 'editar') {
    handleEditarEquipo(formData);
  }

};





  return (
    <div className="equipos-page">
      <div className="equipos-header">
        <h1 className="equipos-title">Gestión de Equipos</h1>
      </div>
      

      <div className="equipos-toolbar">


      {permisos.buscar && (
        <EquiposSearch
          value={searchTerm}
          onChange={handleSearchChange}
        />
      )}

      {permisos.crear && (
          <button 
            className="btn-crear-Equipo"
            onClick={() => abrirModal('crear')}
          >
            <img src={AgregarEquipo} className='btn-add-equipo' alt="Nuevo Equipo" />
            
          </button>


  )}

  </div>

      <EquiposTable
        equipos={equiposPaginados}
        onVer={(e) => abrirModal("ver", e)}
        onEditar={permisos.editar ? (e) => abrirModal("editar", e) : null}
        onEliminar={permisos.eliminar ? handleEliminarEquipo : null} />

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
  modalConfig.mode === 'crear' ? 'Nuevo Equipo' :
  modalConfig.mode === 'editar' ? 'Editar Equipo' :
  'Detalle del Equipo'
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
              disabled={modalConfig.mode === 'ver' ? {
              denominacion: true,
              descripcion: true,
              fechaIncorporacion: true,
              montoInvertido: true,
              oidGrupo: true
  } : {}}
            />
          </Modal>
        )}


    </div>
  );




  
};



export default EquiposPage;
