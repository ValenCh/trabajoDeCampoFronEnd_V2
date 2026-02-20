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
      LISTAR: `${BASE_URL}/administrador/documentos/listarDocumentos`,
      OBTENER: (oidDocumento) => `${BASE_URL}/administrador/documentos/obtenerDocumento/${oidDocumento}`,
      CREAR: (oidGrupo) =>`${BASE_URL}/administrador/documentos/agregarDocumento/${oidGrupo}`,
      ACTUALIZAR: (oidDocumento) => `${BASE_URL}/administrador/documentos/actualizarDocumento/${oidDocumento}`,
      DESCARGAR: (oidDocumento) => `${BASE_URL}/administrador/documentos/descargarDocumento/${oidDocumento}`,
      ELIMINAR : (oidDocumento) => `${BASE_URL}/administrador/documentos/eliminarDocumento/${oidDocumento}`,
    },

    BECARIOS:{
      LISTAR: `${BASE_URL}/administrador/personas/becarios/listarBecarios`,
      OBTENER: (oidBecario) => `${BASE_URL}/administrador/personas/becarios/obtenerBecario/${oidBecario}`,
      CREAR: (oidGrupo) => `${BASE_URL}/administrador/personas/agregarPersona/${oidGrupo}`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/administrador/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/administrador/personas/quitarPersona/${oidPersona}`,
    },

    INVESTIGADORES:{
      LISTAR: `${BASE_URL}/administrador/personas/investigadores/listarInvestigadores`,
      OBTENER: (oidInvestigador) => `${BASE_URL}/administrador/personas/investigadores/obtenerInvestigador/${oidInvestigador}`,
      CREAR: (oidGrupo) => `${BASE_URL}/administrador/personas/agregarPersona/${oidGrupo}`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/administrador/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/administrador/personas/quitarPersona/${oidPersona}`,
    },

    INTEGRANTESCE:{
      LISTAR: `${BASE_URL}/administrador/personas/integrantesConsejoEducativo/listarIntegrantesConsejoEducativo`,
      OBTENER: (oidIntegranteConsejoEducativo) => `${BASE_URL}/administrador/personas/integrantesConsejoEducativo/obtenerIntegranteConsejoEducativo/${oidIntegranteConsejoEducativo}`,
      CREAR: (oidGrupo) => `${BASE_URL}/administrador/personas/agregarPersona/${oidGrupo}`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/administrador/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/administrador/personas/quitarPersona/${oidPersona}`,
    },
    
    PERSONAL:{
      LISTAR: `${BASE_URL}/administrador/personas/personal/listarPersonal`,
      OBTENER: (oidPersonal) => `${BASE_URL}/administrador/personas/personal/obtenerPersonal/${oidPersonal}`,
      CREAR: (oidGrupo) => `${BASE_URL}/administrador/personas/agregarPersona/${oidGrupo}`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/administrador/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/administrador/personas/quitarPersona/${oidPersona}`,
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
    DOCUMENTOS:{
      LISTAR: `${BASE_URL}/director/documentos/listarDocumentos`,
      OBTENER: (oidDocumento) => `${BASE_URL}/director/documentos/obtenerDocumento/${oidDocumento}`,
      CREAR: `${BASE_URL}/director/documentos/agregarDocumento`,
      ACTUALIZAR: (oidDocumento) => `${BASE_URL}/director/documentos/actualizarDocumento/${oidDocumento}`,
      DESCARGAR: (oidDocumento) => `${BASE_URL}/director/documentos/descargarDocumento/${oidDocumento}`,
      QUITAR : (oidDocumento) => `${BASE_URL}/director/documentos/quitarDocumento/${oidDocumento}`,
    },

    BECARIOS:{
      LISTAR: `${BASE_URL}/director/personas/becarios/listarBecarios`,
      OBTENER: (oidBecario) => `${BASE_URL}/director/becarios/obtenerBecario/${oidBecario}`,
      CREAR:`${BASE_URL}/director/personas/agregarPersona`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/director/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/director/personas/quitarPersona/${oidPersona}`,
    },

    INVESTIGADORES:{
      LISTAR: `${BASE_URL}/director/personas/investigadores/listarInvestigadores`,
      OBTENER: (oidInvestigador) => `${BASE_URL}/director/investigadores/obtenerInvestigador/${oidInvestigador}`,
      CREAR:`${BASE_URL}/director/personas/agregarPersona`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/director/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/director/personas/quitarPersona/${oidPersona}`,
    },

    INTEGRANTESCE:{
      LISTAR: `${BASE_URL}/director/personas/integrantesConsejoEducativo/listarIntegrantesConsejoEducativo`,
      OBTENER: (oidIntegranteConsejoEducativo) => `${BASE_URL}/director/personas/integrantesConsejoEducativo/obtenerIntegranteConsejoEducativo/${oidIntegranteConsejoEducativo}`,
      CREAR:`${BASE_URL}/director/personas/agregarPersona`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/director/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/director/personas/quitarPersona/${oidPersona}`,
    },
    
    PERSONAL:{
      LISTAR: `${BASE_URL}/director/personas/personal/listarPersonal`,
      OBTENER: (oidPersonal) => `${BASE_URL}/director/personas/personal/obtenerPersonal/${oidPersonal}`,
      CREAR:`${BASE_URL}/director/personas/agregarPersona`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/director/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/director/personas/quitarPersona/${oidPersona}`,
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

    DOCUMENTOS:{
      LISTAR: `${BASE_URL}/vicedirector/documentos/listarDocumentos`,
      OBTENER: (oidDocumento) => `${BASE_URL}/vicedirector/documentos/obtenerDocumento/${oidDocumento}`,
      CREAR: `${BASE_URL}/vicedirector/documentos/agregarDocumento`,
      ACTUALIZAR: (oidDocumento) => `${BASE_URL}/vicedirector/documentos/actualizarDocumento/${oidDocumento}`,
      DESCARGAR: (oidDocumento) => `${BASE_URL}/vicedirector/documentos/descargarDocumento/${oidDocumento}`,
      QUITAR : (oidDocumento) => `${BASE_URL}/vicedirector/documentos/quitarDocumento/${oidDocumento}`,
    },


    BECARIOS:{
      LISTAR: `${BASE_URL}/vicedirector/personas/becarios/listarBecarios`,
      OBTENER: (oidBecario) => `${BASE_URL}/vicedirector/personas/becarios/obtenerBecario/${oidBecario}`,
      CREAR:`${BASE_URL}/vicedirector/personas/agregarPersona`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/vicedirector/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/vicedirector/personas/quitarPersona/${oidPersona}`,
    },

    INVESTIGADORES:{
      LISTAR: `${BASE_URL}/vicedirector/personas/investigadores/listarInvestigadores`,
      OBTENER: (oidInvestigador) => `${BASE_URL}/vicedirector/personas/investigadores/obtenerInvestigador/${oidInvestigador}`,
      CREAR:`${BASE_URL}/vicedirector/personas/agregarPersona`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/vicedirector/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/vicedirector/personas/quitarPersona/${oidPersona}`,
    },

    INTEGRANTESCE:{
      LISTAR: `${BASE_URL}/vicedirector/personas/integrantesConsejoEducativo/listarIntegrantesConsejoEducativo`,
      OBTENER: (oidIntegranteConsejoEducativo) => `${BASE_URL}/vicedirector/personas/integrantesConsejoEducativo/obtenerIntegranteConsejoEducativo/${oidIntegranteConsejoEducativo}`,
      CREAR:`${BASE_URL}/vicedirector/personas/agregarPersona`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/vicedirector/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/vicedirector/personas/quitarPersona/${oidPersona}`,
    },
    
    PERSONAL:{
      LISTAR: `${BASE_URL}/vicedirector/personas/personal/listarPersonal`,
      OBTENER: (oidPersonal) => `${BASE_URL}/vicedirector/personas/personal/obtenerPersonal/${oidPersonal}`,
      CREAR:`${BASE_URL}/vicedirector/personas/agregarPersona`,
      ACTUALIZAR: (oidPersona) => `${BASE_URL}/vicedirector/personas/actualizarPersona/${oidPersona}`,
      ELIMINAR: (oidPersona) => `${BASE_URL}/vicedirector/personas/quitarPersona/${oidPersona}`,
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
    DOCUMENTOS: {
      LISTAR: `${BASE_URL}/integrante/documentos/listarDocumentos`,
      OBTENER: (oidDocumento) =>`${BASE_URL}/integrante/documentos/obtenerDocumento/${oidDocumento}`,
      DESCARGAR: (oidDocumento) => `${BASE_URL}/integrante/documentos/descargarDocumento/${oidDocumento}`,
    },
    BECARIOS:{
      LISTAR: `${BASE_URL}/integrante/personas/becarios/listarBecarios`,
      OBTENER: (oidBecario) => `${BASE_URL}/integrante/becarios/obtenerBecario/${oidBecario}`,
    },
    INVESTIGADORES:{
      LISTAR: `${BASE_URL}/integrante/personas/investigadores/listarInvestigadores`,
      OBTENER: (oidInvestigador) => `${BASE_URL}/integrante/personas/investigadores/obtenerInvestigador/${oidInvestigador}`,
    },
    INTEGRANTESCE:{
      LISTAR: `${BASE_URL}/integrante/personas/integrantesConsejoEducativo/listarIntegrantesConsejoEducativo`,
      OBTENER: (oidIntegranteConsejoEducativo) => `${BASE_URL}/integrante/personas/integrantesConsejoEducativo/obtenerIntegranteConsejoEducativo/${oidIntegranteConsejoEducativo}`,
    },
    PERSONAL:{
      LISTAR: `${BASE_URL}/integrante/personas/personal/listarPersonal`,
      OBTENER: (oidPersonal) => `${BASE_URL}/integrante/personas/personal/obtenerPersonal/${oidPersonal}`,
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



export const PERMISOS_DOCUMENTOS ={
  [ROLES.ADMINISTRADOR]: {
    verTodos: true,        // Puede ver todos los documentos
    crear: true,           // Puede crear nuevos documentos
    editar: true,          // Puede editar cualquier documento
    eliminar: true,        // Puede eliminar cualquier documento
    buscar: true,          // Puede usar la búsqueda
    paginar: true,         // Puede usar paginación (tiene múltiples documentos)
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

export const PERMISOS_PERSONAS ={

  [ROLES.ADMINISTRADOR]: {
    verTodos: true,        // Puede ver todas las personas
    crear: true,           // Puede crear nuevas personas
    editar: true,          // Puede editar cualquier persona
    eliminar: true,        // Puede eliminar cualquier persona
    buscar: true,          // Puede usar la búsqueda
    paginar: true,         // Puede usar paginación (tiene múltiples personas)
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

export const PERMISOS_BECARIOS ={

  [ROLES.ADMINISTRADOR]: {
      verTodos: true,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,      // Puede usar paginación (tiene múltiples becarios)
  },

  [ROLES.DIRECTOR]: {
      verTodos: false,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,
  },

    [ROLES.VICEDIRECTOR]: {
      verTodos: false,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,
  },

    [ROLES.INTEGRANTE]: {
      verTodos: false,
      crear: false,
      editar: false,
      eliminar: false,
      buscar: true,
      paginar: true,
  },

};



export const PERMISOS_INVESTIGADORES ={

  [ROLES.ADMINISTRADOR]: {
      verTodos: true,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,      

  },

  [ROLES.DIRECTOR]: {
      verTodos: false,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,
  },

    [ROLES.VICEDIRECTOR]: {
      verTodos: false,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,
  },

    [ROLES.INTEGRANTE]: {
      verTodos: false,
      crear: false,
      editar: false,
      eliminar: false,
      buscar: true,
      paginar: true,
  },

};


export const PERMISOS_INTEGRANTESCE ={

  [ROLES.ADMINISTRADOR]: {
      verTodos: true,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,      

  },

  [ROLES.DIRECTOR]: {
      verTodos: false,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,
  },

    [ROLES.VICEDIRECTOR]: {
      verTodos: false,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,
  },

    [ROLES.INTEGRANTE]: {
      verTodos: false,
      crear: false,
      editar: false,
      eliminar: false,
      buscar: true,
      paginar: true,
  },

};

export const PERMISOS_PERSONAL ={

  [ROLES.ADMINISTRADOR]: {
      verTodos: true,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,      

  },

  [ROLES.DIRECTOR]: {
      verTodos: false,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,
  },

    [ROLES.VICEDIRECTOR]: {
      verTodos: false,
      crear: true,
      editar: true,
      eliminar: true,
      buscar: true,
      paginar: true,
  },

    [ROLES.INTEGRANTE]: {
      verTodos: false,
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

export const obtenerPermisosDocumentos = (rol) => {
  return PERMISOS_DOCUMENTOS[rol] || {};
};

export const obtenerEndpointsDocumentos = (rol) => {
  return ENDPOINTS[rol]?.DOCUMENTOS || {};
};

export const obtenerPermisosBecarios = (rol) => {
  return PERMISOS_BECARIOS[rol] || {};
};

export const obtenerEndpointsBecarios = (rol) => {
  return ENDPOINTS[rol]?.BECARIOS || {};
};


export const obtenerPermisosInvestigadores = (rol) => {
  return PERMISOS_INVESTIGADORES[rol] || {};
};

export const obtenerEndpointsInvestigadores = (rol) => {
  return ENDPOINTS[rol]?.INVESTIGADORES || {};
};

export const obtenerPermisosPersonal = (rol) => {
  return PERMISOS_PERSONAL[rol] || {};
};

export const obtenerEndpointsPersonal = (rol) => {
  return ENDPOINTS[rol]?.PERSONAL || {};
};

export const obtenerPermisosIntegrantesCE = (rol) => {
  return PERMISOS_INTEGRANTESCE[rol] || {};
};

export const obtenerEndpointsIntegrantesCE = (rol) => {
  return ENDPOINTS[rol]?.INTEGRANTESCE || {};
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