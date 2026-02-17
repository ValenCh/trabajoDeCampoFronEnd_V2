/**
 * permissions.js
 * 
 * Sistema centralizado de permisos y configuración de endpoints por rol.
 * Define qué puede hacer cada rol y qué rutas debe usar.
 * 
 * Roles disponibles (según backend):
 * - Administrador: acceso completo a todos los grupos
 * - Director: puede ver y editar su propio grupo
 * - ViceDirector: solo puede ver su propio grupo
 * - Integrante: solo puede ver su propio grupo
 */

// ═══════════════════════════════════════════════════════════════════════════
// ROLES DEL SISTEMA (EXACTOS COMO LOS DEVUELVE EL BACKEND)
// ═══════════════════════════════════════════════════════════════════════════

export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  DIRECTOR: 'Director',
  VICEDIRECTOR: 'ViceDirector',
  INTEGRANTE: 'Integrante',
};

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE ENDPOINTS POR ROL
// ═══════════════════════════════════════════════════════════════════════════

const BASE_URL = 'http://localhost:8081';

export const ENDPOINTS = {
  // ─── ADMINISTRADOR ───────────────────────────────────────────────────────
  [ROLES.ADMINISTRADOR]: {
    GRUPOS: {
      LISTAR: `${BASE_URL}/administrador/grupos/listarGrupos`,
      OBTENER: (oidGrupo) => `${BASE_URL}/administrador/grupos/obtenerGrupo/${oidGrupo}`,
      CREAR: `${BASE_URL}/administrador/grupos/agregarGrupo`,
      ACTUALIZAR: (oidGrupo) => `${BASE_URL}/administrador/grupos/actualizarGrupo/${oidGrupo}`,
      ELIMINAR: (oidGrupo) => `${BASE_URL}/administrador/grupos/eliminarGrupo/${oidGrupo}`,
    },
  },

  // ─── DIRECTOR ────────────────────────────────────────────────────────────
  [ROLES.DIRECTOR]: {
    GRUPOS: {
      VER: `${BASE_URL}/director/grupo/ver`,
      EDITAR: `${BASE_URL}/director/grupo/editar`,
    },
  },

  // ─── VICEDIRECTOR ────────────────────────────────────────────────────────
  [ROLES.VICEDIRECTOR]: {
    GRUPOS: {
      VER: `${BASE_URL}/viceDirector/grupo/ver`,
    },
  },

  // ─── INTEGRANTE ──────────────────────────────────────────────────────────
  [ROLES.INTEGRANTE]: {
    GRUPOS: {
      VER: `${BASE_URL}/integrante/grupo/ver`,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// PERMISOS POR ROL
// ═══════════════════════════════════════════════════════════════════════════

export const PERMISOS_GRUPOS = {
  [ROLES.ADMINISTRADOR]: {
    verTodos: true,        // Puede ver todos los grupos
    verPropio: true,       // Puede ver su propio grupo
    crear: true,           // Puede crear nuevos grupos
    editar: true,          // Puede editar cualquier grupo
    eliminar: true,        // Puede eliminar cualquier grupo
    buscar: true,          // Puede usar la búsqueda
    paginar: true,         // Puede usar paginación (tiene múltiples grupos)
  },
  [ROLES.DIRECTOR]: {
    verTodos: false,
    verPropio: true,
    crear: false,
    editar: true,          // Puede editar solo su grupo
    eliminar: false,
    buscar: false,         // No necesita búsqueda (solo ve su grupo)
    paginar: false,        // No necesita paginación (solo un grupo)
  },
  [ROLES.VICEDIRECTOR]: {
    verTodos: false,
    verPropio: true,
    crear: false,
    editar: false,
    eliminar: false,
    buscar: false,
    paginar: false,
  },
  [ROLES.INTEGRANTE]: {
    verTodos: false,
    verPropio: true,
    crear: false,
    editar: false,
    eliminar: false,
    buscar: false,
    paginar: false,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES HELPER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene los permisos de un rol específico
 * @param {string} rol - Rol del usuario (ej: "Administrador", "Director")
 * @returns {object} Objeto con los permisos del rol
 */
export const obtenerPermisos = (rol) => {
  return PERMISOS_GRUPOS[rol] || PERMISOS_GRUPOS[ROLES.INTEGRANTE];
};

/**
 * Verifica si un rol tiene un permiso específico
 * @param {string} rol - Rol del usuario
 * @param {string} permiso - Nombre del permiso a verificar
 * @returns {boolean}
 */
export const tienePermiso = (rol, permiso) => {
  const permisos = obtenerPermisos(rol);
  return permisos[permiso] === true;
};

/**
 * Obtiene los endpoints de grupos según el rol
 * @param {string} rol - Rol del usuario
 * @returns {object} Objeto con los endpoints disponibles para ese rol
 */
export const obtenerEndpointsGrupos = (rol) => {
  return ENDPOINTS[rol]?.GRUPOS || ENDPOINTS[ROLES.INTEGRANTE].GRUPOS;
};

/**
 * Construye los headers de autenticación con JWT
 * @param {object} extraHeaders - Headers adicionales
 * @returns {object} Headers con Authorization
 */
export const construirHeaders = (extraHeaders = {}) => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${usuario.token}`,
    ...extraHeaders,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS DE ROLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Verifica si el usuario es administrador
 * @param {string} rol - Rol del usuario
 * @returns {boolean}
 */
export const esAdministrador = (rol) => rol === ROLES.ADMINISTRADOR;

/**
 * Verifica si el usuario es director
 * @param {string} rol - Rol del usuario
 * @returns {boolean}
 */
export const esDirector = (rol) => rol === ROLES.DIRECTOR;

/**
 * Verifica si el usuario es vicedirector
 * @param {string} rol - Rol del usuario
 * @returns {boolean}
 */
export const esViceDirector = (rol) => rol === ROLES.VICEDIRECTOR;

/**
 * Verifica si el usuario es integrante
 * @param {string} rol - Rol del usuario
 * @returns {boolean}
 */
export const esIntegrante = (rol) => rol === ROLES.INTEGRANTE;

/**
 * Verifica si el usuario puede ver múltiples grupos (solo administrador)
 * @param {string} rol - Rol del usuario
 * @returns {boolean}
 */
export const puedeVerMultiplesGrupos = (rol) => esAdministrador(rol);

/**
 * Verifica si el usuario necesita tabla completa o solo vista de detalles
 * @param {string} rol - Rol del usuario
 * @returns {boolean} true si necesita tabla, false si necesita vista de detalles
 */
export const necesitaTabla = (rol) => esAdministrador(rol);

/**
 * Obtiene el usuario del localStorage
 * @returns {object} Objeto con datos del usuario (token, role, grupo?)
 */
export const obtenerUsuario = () => {
  return JSON.parse(localStorage.getItem('usuario') || '{}');
};

/**
 * Verifica si el usuario tiene un grupo asignado
 * @returns {boolean}
 */
export const tieneGrupoAsignado = () => {
  const usuario = obtenerUsuario();
  return !!usuario.grupo;
};

/**
 * Obtiene el ID del grupo del usuario
 * @returns {number|null} ID del grupo o null si no tiene
 */
export const obtenerIdGrupo = () => {
  const usuario = obtenerUsuario();
  return usuario.grupo?.oidGrupo || null;
};