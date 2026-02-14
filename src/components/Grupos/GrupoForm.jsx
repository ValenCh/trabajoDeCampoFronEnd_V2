import React, { useState, useEffect, useRef } from 'react';
import './GrupoForm.css';

const ENDPOINT_PERSONAS = 'http://localhost:8081/AdministracionController/personas/listarPersonas';

/**
 * GrupoForm
 *
 * Formulario unificado para CREAR y EDITAR un grupo.
 * Maneja su propio fetch de personas para los selects de director/vice-director.
 * Los dos selects están cruzados: no se puede elegir la misma persona en ambos.
 *
 * Props:
 *  - initialData: object   → datos precargados (edición). Vacío = creación.
 *  - onSubmit: function    → recibe el objeto de datos del form al confirmar
 *  - formId: string        → id del <form> para dispatchEvent desde el Modal padre
 *  - disabled: object      → mapa de campos deshabilitados: { nombreGrupo: true, ... }
 *                            Por defecto todos habilitados.
 *                            Ejemplo para bloquear solo la sigla:
 *                            disabled={{ sigla: true }}
 *  - showComparison: bool  → si es true, marca los campos modificados (modo edición)
 *
 * Campos del formulario:
 *  - nombreGrupo   (texto, requerido)
 *  - sigla         (texto, requerido)
 *  - email         (email, requerido)
 *  - director      (select de personas, opcional)
 *  - viceDirector  (select de personas, opcional)
 *  - objetivos     (textarea, opcional)
 *  - organigrama   (texto URL/path, opcional)
 *                  // TODO: cambiar a input tipo file cuando el backend defina
 *                  // si espera binario (multipart/form-data) o URL como texto.
 */
const GrupoForm = ({
  initialData = {},
  onSubmit,
  formId,
  disabled = {},
  showComparison = false,
}) => {
  // ── Estado del formulario ──
  const [formData, setFormData] = useState({
    nombreGrupo:  initialData.nombreGrupo  || '',
    sigla:        initialData.sigla        || '',
    email:        initialData.email        || '',
    director:     initialData.director     || '',  // almacena oidPersona
    viceDirector: initialData.viceDirector || '',  // almacena oidPersona
    objetivos:    initialData.objetivos    || '',
    organigrama:  initialData.organigrama  || '',
  });

  const originalData = useRef({ ...formData });
  const [errors, setErrors]   = useState({});

  // ── Estado de personas ──
  const [personas, setPersonas]             = useState([]);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [errorPersonas, setErrorPersonas]   = useState(null);

  // ── Fetch de personas ──
  useEffect(() => {
    const cargarPersonas = async () => {
      setLoadingPersonas(true);
      setErrorPersonas(null);
      try {
        const res = await fetch(ENDPOINT_PERSONAS);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const data = await res.json();
        setPersonas(data);
      } catch (err) {
        setErrorPersonas('No se pudo cargar la lista de personas.');
      } finally {
        setLoadingPersonas(false);
      }
    };
    cargarPersonas();
  }, []);

  // ── Helpers ──

  // Construye el nombre completo para mostrar en el select
  const nombreCompleto = (persona) =>
    `${persona.nombre || ''} ${persona.apellido || ''}`.trim();

  // Determina si un campo fue modificado respecto al valor original
  const fueModificado = (campo) =>
    showComparison && formData[campo] !== originalData.current[campo];

  // ── Handlers ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ── Validación ──
  const validate = () => {
    const newErrors = {};

    if (!disabled.nombreGrupo && !formData.nombreGrupo.trim())
      newErrors.nombreGrupo = 'El nombre del grupo es requerido';

    if (!disabled.sigla && !formData.sigla.trim())
      newErrors.sigla = 'La sigla de la facultad es requerida';

    if (!disabled.email) {
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'El email no tiene un formato válido';
      }
    }

    // Si eligieron director y vice, no pueden ser la misma persona
    if (
      formData.director &&
      formData.viceDirector &&
      formData.director === formData.viceDirector
    ) {
      newErrors.viceDirector = 'El vice-director no puede ser la misma persona que el director';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  // ── Opciones filtradas para cada select ──
  // Director: excluye al vice-director actualmente elegido
  const opcionesDirector = personas.filter(
    (p) => String(p.oidPersona) !== String(formData.viceDirector)
  );
  // Vice-director: excluye al director actualmente elegido
  const opcionesVice = personas.filter(
    (p) => String(p.oidPersona) !== String(formData.director)
  );

  // ── Render ──
  return (
    <form
      id={formId}
      className="grupo-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grupo-form-grid">

        {/* ── SECCIÓN: Datos generales ── */}
        <div className="grupo-form-section-title">Datos generales</div>

        {/* Nombre */}
        <div className="grupo-form-field full-width">
          <label htmlFor="gf-nombreGrupo" className="grupo-form-label">
            Nombre del Grupo <span className="req">*</span>
          </label>
          <input
            id="gf-nombreGrupo"
            name="nombreGrupo"
            type="text"
            className={[
              'grupo-input',
              fueModificado('nombreGrupo') ? 'changed' : '',
            ].join(' ')}
            value={formData.nombreGrupo}
            onChange={handleChange}
            placeholder="Ej: GIDAS"
            disabled={!!disabled.nombreGrupo}
          />
          {fueModificado('nombreGrupo') && originalData.current.nombreGrupo && (
            <span className="grupo-original-hint">
              Original: {originalData.current.nombreGrupo}
            </span>
          )}
          {errors.nombreGrupo && (
            <span className="grupo-form-error">{errors.nombreGrupo}</span>
          )}
        </div>

        {/* Sigla */}
        <div className="grupo-form-field">
          <label htmlFor="gf-sigla" className="grupo-form-label">
            Sigla Facultad Regional <span className="req">*</span>
          </label>
          <input
            id="gf-sigla"
            name="sigla"
            type="text"
            className={[
              'grupo-input',
              fueModificado('sigla') ? 'changed' : '',
            ].join(' ')}
            value={formData.sigla}
            onChange={handleChange}
            placeholder="Ej: FRLP"
            disabled={!!disabled.sigla}
          />
          {fueModificado('sigla') && originalData.current.sigla && (
            <span className="grupo-original-hint">
              Original: {originalData.current.sigla}
            </span>
          )}
          {errors.sigla && (
            <span className="grupo-form-error">{errors.sigla}</span>
          )}
        </div>

        {/* Email */}
        <div className="grupo-form-field">
          <label htmlFor="gf-email" className="grupo-form-label">
            Email <span className="req">*</span>
          </label>
          <input
            id="gf-email"
            name="email"
            type="email"
            className={[
              'grupo-input',
              fueModificado('email') ? 'changed' : '',
            ].join(' ')}
            value={formData.email}
            onChange={handleChange}
            placeholder="grupo@utn.edu.ar"
            disabled={!!disabled.email}
          />
          {fueModificado('email') && originalData.current.email && (
            <span className="grupo-original-hint">
              Original: {originalData.current.email}
            </span>
          )}
          {errors.email && (
            <span className="grupo-form-error">{errors.email}</span>
          )}
        </div>

        {/* ── SECCIÓN: Autoridades ── */}
        <div className="grupo-form-section-title">Autoridades</div>

        {/* Estado de carga / error de personas */}
        {loadingPersonas && (
          <div className="grupo-form-field full-width">
            <p className="grupo-personas-loading">
              <i className="fa-solid fa-spinner fa-spin" /> Cargando lista de personas...
            </p>
          </div>
        )}

        {errorPersonas && !loadingPersonas && (
          <div className="grupo-form-field full-width">
            <p className="grupo-form-error">{errorPersonas}</p>
          </div>
        )}

        {/* Director */}
        {!loadingPersonas && !errorPersonas && (
          <div className="grupo-form-field">
            <label htmlFor="gf-director" className="grupo-form-label">
              Director
            </label>
            <select
              id="gf-director"
              name="director"
              className={[
                'grupo-input',
                'grupo-select',
                fueModificado('director') ? 'changed' : '',
              ].join(' ')}
              value={formData.director}
              onChange={handleChange}
              disabled={!!disabled.director}
            >
              <option value="">— Sin asignar —</option>
              {opcionesDirector.map((persona) => (
                <option key={persona.oidPersona} value={persona.oidPersona}>
                  {nombreCompleto(persona)}
                </option>
              ))}
            </select>
            {fueModificado('director') && (
              <span className="grupo-original-hint">
                Valor modificado
              </span>
            )}
          </div>
        )}

        {/* Vice-Director */}
        {!loadingPersonas && !errorPersonas && (
          <div className="grupo-form-field">
            <label htmlFor="gf-viceDirector" className="grupo-form-label">
              Vice-Director
            </label>
            <select
              id="gf-viceDirector"
              name="viceDirector"
              className={[
                'grupo-input',
                'grupo-select',
                fueModificado('viceDirector') ? 'changed' : '',
              ].join(' ')}
              value={formData.viceDirector}
              onChange={handleChange}
              disabled={!!disabled.viceDirector}
            >
              <option value="">— Sin asignar —</option>
              {opcionesVice.map((persona) => (
                <option key={persona.oidPersona} value={persona.oidPersona}>
                  {nombreCompleto(persona)}
                </option>
              ))}
            </select>
            {fueModificado('viceDirector') && (
              <span className="grupo-original-hint">
                Valor modificado
              </span>
            )}
            {errors.viceDirector && (
              <span className="grupo-form-error">{errors.viceDirector}</span>
            )}
          </div>
        )}

        {/* Placeholder para el segundo campo de la fila si personas no cargaron */}
        {(loadingPersonas || errorPersonas) && (
          <div className="grupo-form-field" />
        )}

        {/* ── SECCIÓN: Descripción ── */}
        <div className="grupo-form-section-title">Descripción</div>

        {/* Objetivos */}
        <div className="grupo-form-field full-width">
          <label htmlFor="gf-objetivos" className="grupo-form-label">
            Objetivos
          </label>
          <textarea
            id="gf-objetivos"
            name="objetivos"
            className={[
              'grupo-input',
              'grupo-textarea',
              fueModificado('objetivos') ? 'changed' : '',
            ].join(' ')}
            value={formData.objetivos}
            onChange={handleChange}
            placeholder="Describí los objetivos del grupo de investigación..."
            rows={4}
            disabled={!!disabled.objetivos}
          />
          {fueModificado('objetivos') && (
            <span className="grupo-original-hint">Valor modificado</span>
          )}
        </div>

        {/* Organigrama */}
        {/* TODO: cuando el backend defina si espera archivo binario (multipart/form-data)
            o URL/path como texto, cambiar este campo:
            - Si es archivo binario → cambiar type="text" por type="file" y usar FormData en el submit
            - Si es URL → queda como está */}
        <div className="grupo-form-field full-width">
          <label htmlFor="gf-organigrama" className="grupo-form-label">
            Organigrama
            <span style={{ fontSize: '0.72rem', color: '#aaa', marginLeft: '6px', fontWeight: 400 }}>
              (URL o nombre del archivo)
            </span>
          </label>
          <input
            id="gf-organigrama"
            name="organigrama"
            type="text"
            className={[
              'grupo-input',
              fueModificado('organigrama') ? 'changed' : '',
            ].join(' ')}
            value={formData.organigrama}
            onChange={handleChange}
            placeholder="https://... o nombre del archivo"
            disabled={!!disabled.organigrama}
          />
          {fueModificado('organigrama') && originalData.current.organigrama && (
            <span className="grupo-original-hint">
              Original: {originalData.current.organigrama}
            </span>
          )}
        </div>

      </div>
    </form>
  );
};

export default GrupoForm;