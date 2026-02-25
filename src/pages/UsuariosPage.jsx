import React, { useEffect, useState } from 'react';
import Alertas from '../components/Alertas/Alertas';
import { construirHeaders } from '../config/permissions';
import './UsuariosPage.css';

const ROLES = ['ADMINISTRADOR', 'DIRECTOR', 'VICEDIRECTOR', 'INTEGRANTE'];
const TIPOS_PERSONA = ['Becario', 'Investigador', 'Personal', 'IntegranteConsejoEducativo'];
const BASE_URL = 'http://localhost:8081';

const PERSONA_INICIAL = {
  nombre: '',
  apellido: '',
  horasSemanales: '',
  tipoPersona: '',
  categoriaUTN: '',
  programaDeIncentivos: '',
  dedicacion: '',
  gradoAcademico: ''
};

const UsuariosPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [role, setRole] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
  const [persona, setPersona] = useState(PERSONA_INICIAL);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        const response = await fetch(`${BASE_URL}/administrador/grupos/listarGrupos`, {
          headers: construirHeaders()
        });
        const data = await response.json();
        const gruposData = Array.isArray(data) ? data : [];
        setGrupos(gruposData);
        if (gruposData.length > 0) {
          setGrupoSeleccionado(String(gruposData[0].oidGrupo));
        }
      } catch {
        setGrupos([]);
      }
    };

    cargarGrupos();
  }, []);

  const handlePersonaChange = (e) => {
    const { name, value } = e.target;
    setPersona((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setEmail('');
    setPassword('');
    setConfirmarPassword('');
    setRole('');
    setGrupoSeleccionado(grupos.length > 0 ? String(grupos[0].oidGrupo) : '');
    setPersona(PERSONA_INICIAL);
  };

  const extraerOidPersona = (data) => {
    if (!data || typeof data !== 'object') return null;
    if (data.oidPersona) return data.oidPersona;
    if (data.id) return data.id;
    if (data.persona?.oidPersona) return data.persona.oidPersona;
    if (data.data?.oidPersona) return data.data.oidPersona;
    return null;
  };

  const parsearRespuestaJson = (raw, errorMessage) => {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setAlert({ type: 'error', title: 'Error', message: 'Email y contraseña son obligatorios' });
      return;
    }

    if (!role) {
      setAlert({ type: 'error', title: 'Error', message: 'Debe seleccionar un rol' });
      return;
    }

    if (!grupoSeleccionado) {
      setAlert({ type: 'error', title: 'Error', message: 'Debe seleccionar un grupo' });
      return;
    }

    if (!persona.tipoPersona) {
      setAlert({ type: 'error', title: 'Error', message: 'Debe seleccionar un tipo de persona' });
      return;
    }

    if (password !== confirmarPassword) {
      setAlert({ type: 'error', title: 'Error', message: 'Las contraseñas no coinciden' });
      return;
    }

    if (password.length < 6) {
      setAlert({ type: 'error', title: 'Error', message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setLoading(true);
    try {
      const crearPersonaResponse = await fetch(`${BASE_URL}/administrador/personas/agregarPersona/${grupoSeleccionado}`, {
        method: 'POST',
        headers: construirHeaders(),
        body: JSON.stringify(persona)
      });

      if (!crearPersonaResponse.ok) {
        throw new Error(await crearPersonaResponse.text() || 'No se pudo crear la persona');
      }

      const personaCreadaRaw = await crearPersonaResponse.text();
      const personaCreada = parsearRespuestaJson(personaCreadaRaw, 'La creación de persona no devolvió JSON válido');
      const oidPersonaCreada = extraerOidPersona(personaCreada);
      if (!oidPersonaCreada) throw new Error('No se pudo obtener oidPersona de la persona creada');

      const asociarUsuarioResponse = await fetch(`${BASE_URL}/administrador/usuarios/asociarUsuario`, {
        method: 'POST',
        headers: construirHeaders(),
        body: JSON.stringify({
          oidPersona: oidPersonaCreada,
          email: email.trim(),
          password,
          role
        })
      });

      const mensaje = await asociarUsuarioResponse.text();
      if (!asociarUsuarioResponse.ok) throw new Error(mensaje || 'No se pudo asociar el usuario');

      limpiarFormulario();
      setAlert({
        type: 'exito',
        title: 'Éxito',
        message: mensaje || 'Usuario creado y asociado a persona correctamente'
      });
    } catch (err) {
      setAlert({ type: 'error', title: 'Error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="usuarios-page">
      <h1 className="usuarios-title">Administración de Usuarios</h1>

      <form className="usuarios-form" onSubmit={handleSubmit}>
        <h2>Cuenta</h2>
        <div className="usuarios-grid">
          <label>
            Email *
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Contraseña *
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label>
            Confirmar contraseña *
            <input type="password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} required />
          </label>
          <label>
            Rol *
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">-- Seleccionar rol --</option>
              {ROLES.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </select>
          </label>
          <label>
            Grupo *
            <select value={grupoSeleccionado} onChange={(e) => setGrupoSeleccionado(e.target.value)} required>
              <option value="">-- Seleccionar grupo --</option>
              {grupos.map((grupo) => (
                <option key={grupo.oidGrupo} value={grupo.oidGrupo}>
                  {grupo.nombreGrupo || `Grupo ${grupo.oidGrupo}`}
                </option>
              ))}
            </select>
          </label>
        </div>

        <h2>Persona asociada</h2>
        <div className="usuarios-grid">
          <label>
            Nombre
            <input name="nombre" type="text" value={persona.nombre} onChange={handlePersonaChange} />
          </label>
          <label>
            Apellido
            <input name="apellido" type="text" value={persona.apellido} onChange={handlePersonaChange} />
          </label>
          <label>
            Horas semanales
            <input name="horasSemanales" type="number" value={persona.horasSemanales} onChange={handlePersonaChange} />
          </label>
          <label>
            Tipo de persona
            <select name="tipoPersona" value={persona.tipoPersona} onChange={handlePersonaChange}>
              <option value="">-- Seleccionar tipo --</option>
              {TIPOS_PERSONA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>
          <label>
            Categoría UTN
            <input name="categoriaUTN" type="text" value={persona.categoriaUTN} onChange={handlePersonaChange} />
          </label>
          <label>
            Programa de incentivos
            <input name="programaDeIncentivos" type="text" value={persona.programaDeIncentivos} onChange={handlePersonaChange} />
          </label>
          <label>
            Dedicación
            <input name="dedicacion" type="text" value={persona.dedicacion} onChange={handlePersonaChange} />
          </label>
          <label>
            Grado académico
            <input name="gradoAcademico" type="text" value={persona.gradoAcademico} onChange={handlePersonaChange} />
          </label>
        </div>

        <button type="submit" className="usuarios-submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear usuario y asociar persona'}
        </button>
      </form>

      {alert && (
        <Alertas
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
          onAccept={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default UsuariosPage;
