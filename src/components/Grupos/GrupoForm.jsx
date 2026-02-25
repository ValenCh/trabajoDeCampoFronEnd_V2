import React, { useState, useEffect, useRef } from 'react';
import { construirHeaders } from '../../config/permissions';
import './GrupoForm.css';

const ENDPOINT_PERSONAS = 'http://localhost:8081/AdministracionController/personas/listarPersonas';

const GrupoForm = ({
  initialData = {},
  onSubmit,
  formId,
  disabled = {},
  showComparison = false,
}) => {
  const [formData, setFormData] = useState({
    nombreGrupo:  initialData.nombreGrupo  || '',
    sigla:        initialData.sigla        || '',
    email:        initialData.email        || '',
    director:     initialData.director     || '',
    viceDirector: initialData.viceDirector || '',
    objetivos:    initialData.objetivos    || '',
    organigrama:  initialData.organigrama  || '',
  });

  const originalData = useRef({ ...formData });
  const [errors, setErrors]   = useState({});

  const [personas, setPersonas]               = useState([]);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [errorPersonas, setErrorPersonas]     = useState(null);

  useEffect(() => {
    const cargarPersonas = async () => {
      setLoadingPersonas(true);
      setErrorPersonas(null);
      try {
        const res = await fetch(ENDPOINT_PERSONAS, {
          method: 'GET',
          headers: construirHeaders()
        });
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

  const nombreCompleto = (persona) =>
    `${persona.nombre || ''} ${persona.apellido || ''}`.trim();

  const fueModificado = (campo) =>
    showComparison && formData[campo] !== originalData.current[campo];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const opcionesDirector = personas.filter(
    (p) => String(p.oidPersona) !== String(formData.viceDirector)
  );
  const opcionesVice = personas.filter(
    (p) => String(p.oidPersona) !== String(formData.director)
  );

  return (
    <form
      id={formId}
      className="grupo-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grupo-form-grid">

        {/* Nombre */}
        <div className="grupo-form-field">
          <label htmlFor="gf-nombreGrupo" className="grupo-form-label">
            Nombre del Grupo <span className="req">*</span>
          </label>
          <input
            id="gf-nombreGrupo"
            name="nombreGrupo"
            type="text"
            className={['grupo-input', fueModificado('nombreGrupo') ? 'changed' : ''].join(' ')}
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
            className={['grupo-input', fueModificado('sigla') ? 'changed' : ''].join(' ')}
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
            className={['grupo-input', fueModificado('email') ? 'changed' : ''].join(' ')}
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

        {/* Organigrama */}
        <div className="grupo-form-field">
          <label htmlFor="gf-organigrama" className="grupo-form-label">
            Organigrama
          </label>
          <input
            id="gf-organigrama"
            name="organigrama"
            type="text"
            className={['grupo-input', fueModificado('organigrama') ? 'changed' : ''].join(' ')}
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

        {/* Objetivos */}
        <div className="grupo-form-field">
          <label htmlFor="gf-objetivos" className="grupo-form-label">
            Objetivos
          </label>
          <textarea
            id="gf-objetivos"
            name="objetivos"
            className={['grupo-input', 'grupo-textarea', fueModificado('objetivos') ? 'changed' : ''].join(' ')}
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
        </div>

      </div>
    </form>
  );
};

export default GrupoForm;