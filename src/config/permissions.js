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
  ADMINISTRADOR: 'ADMINISTRADOR',
  DIRECTOR: 'DIRECTOR',
  VICEDIRECTOR: 'VICEDIRECTOR',
  INTEGRANTE: 'INTEGRANTE',
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
    EQUIPOS:{
      LISTAR: `${BASE_URL}/administrador/equipos/listarEquipos`,
      OBTENER: (oidEquipo) => `${BASE_URL}/administrador/equipos/obtenerEquipo/${oidEquipo}`,
      CREAR: `${BASE_URL}/administrador/equipos/agregarEquipo`,
      ACTUALIZAR: (oidEquipo) => `${BASE_URL}/administrador/equipos/actualizarEquipo/${oidEquipo}`,
      ELIMINAR : (oidEquipo) => `${BASE_URL}/administrador/equipos/eliminarEquipo/${oidEquipo}`,
    },
    DOCUMENTOS:{
      LISTAR: `${BASE_URL}/administrador/documentos/listarEquipos`,
      OBTENER: (oidEquipo) => `${BASE_URL}/administrador/documentos/obtenerEquipo/${oidEquipo}`,
      CREAR: `${BASE_URL}/administrador/documentos/agregarEquipo`,
      ACTUALIZAR: (oidEquipo) => `${BASE_URL}/administrador/documentos/actualizarEquipo/${oidEquipo}`,
      ELIMINAR : (oidEquipo) => `${BASE_URL}/administrador/documentos/eliminarEquipo/${oidEquipo}`,
    },

  },

  // ─── DIRECTOR ────────────────────────────────────────────────────────────
  [ROLES.DIRECTOR]: {
    GRUPOS: {
      VER: `${BASE_URL}/director/grupo/ver`,
      ACTUALIZAR: `${BASE_URL}/director/grupo/editar`,
    },
        EQUIPOS:{
      LISTAR: `${BASE_URL}/director/equipos/listarEquipos`,
      OBTENER: (oidEquipo) => `${BASE_URL}/director/equipos/obtenerEquipo/${oidEquipo}`,
      CREAR: `${BASE_URL}/director/equipos/agregarEquipo`,
      ACTUALIZAR: (oidEquipo) => `${BASE_URL}/director/equipos/actualizarEquipo/${oidEquipo}`,
      QUITAR : (oidEquipo) => `${BASE_URL}/director/equipos/quitarEquipo/${oidEquipo}`,
    },
  },

  // ─── VICEDIRECTOR ────────────────────────────────────────────────────────
  [ROLES.VICEDIRECTOR]: {
    GRUPOS: {
      VER: `${BASE_URL}/vicedirector/grupo/ver`,
    },
        EQUIPOS:{
      LISTAR: `${BASE_URL}/vicedirector/equipos/listarEquipos`,
      OBTENER: (oidEquipo) => `${BASE_URL}/vicedirector/equipos/obtenerEquipo/${oidEquipo}`,
      CREAR: `${BASE_URL}/vicedirector/equipos/agregarEquipo`,
      ACTUALIZAR: (oidEquipo) => `${BASE_URL}/vicedirector/equipos/actualizarEquipo/${oidEquipo}`,
      QUITAR : (oidEquipo) => `${BASE_URL}/vicedirector/equipos/quitarEquipo/${oidEquipo}`,
    },

  },

  // ─── INTEGRANTE ──────────────────────────────────────────────────────────
  [ROLES.INTEGRANTE]: {
    GRUPOS: {
      VER: `${BASE_URL}/integrante/grupo/ver`,
    },
    EQUIPOS: {
      LISTAR: `${BASE_URL}/integrante/equipos/listarEquipo`,
      OBTENER: (oidEquipo) =>`${BASE_URL}/integrante/equipos/obtenerEquipo/${oidEquipo}`,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// PERMISOS POR ROL
// ═══════════════════════════════════════════════════════════════════════════

export const PERMISOS_GRUPOS = {
  [ROLES.ADMINISTRADOR]: {
    verTodos: true,        // Puede ver todos los grupos
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

export const PERMISOS_EQUIPOS ={
  [ROLES.ADMINISTRADOR]: {
    verTodos: true,        // Puede ver todos los equipos
    crear: true,           // Puede crear nuevos equipos
    editar: true,          // Puede editar cualquier equipo
    eliminar: true,        // Puede eliminar cualquier equipo
    buscar: true,          // Puede usar la búsqueda
    paginar: true,         // Puede usar paginación (tiene múltiples equipos)
  },

  [ROLES.DIRECTOR]: {
  verTodos: false,
  verPropio: true,
  crear: true,
  editar: true,
  eliminar: true,
  buscar: true,
  paginar: true,
},

  [ROLES.VICEDIRECTOR]: {
    verTodos: false,
    verPropio: true,
    crear: true,
    editar: true,
    eliminar: true,
    buscar: true,
    paginar: true,
  },


  [ROLES.INTEGRANTE]: {
  verTodos: false,
  verPropio: true,
  crear: false,
  editar: false,
  eliminar: false,
  buscar: true,
  paginar: true,
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


export const obtenerPermisosEquipos = (rol) => {
  return PERMISOS_EQUIPOS[rol] || {};
};

export const obtenerEndpointsEquipos = (rol) => {
  return ENDPOINTS[rol]?.EQUIPOS ||  {};
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
export const necesitaTabla = (rol) => {
  return rol === ROLES.ADMINISTRADOR || rol === ROLES.INTEGRANTE || rol === ROLES.DIRECTOR || rol === ROLES.VICEDIRECTOR ;
};
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