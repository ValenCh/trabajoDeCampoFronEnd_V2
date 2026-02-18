import React, { useState, useRef, useEffect } from 'react';
import './EquipoForm.css';
import { obtenerUsuario } from '../../config/permissions';

const EquipoForm = ({
  initialData = null,
  onSubmit,
  formId,
  disabled = {},
  showComparison = false,
  grupos = [] // lista de grupos disponible solo para admin
}) => {

  const usuario = obtenerUsuario();
  const esAdmin = usuario.role === 'ADMINISTRADOR';

  const [formData, setFormData] = useState({
    denominacion: '',
    descripcion: '',
    fechaIncorporacion: '',
    montoInvertido: '',
    oidGrupo: esAdmin ? '' : usuario.grupo?.oidGrupo || '',
    activo: true
  });

  const originalData = useRef({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialData) return;

    const grupoId = esAdmin
      ? initialData.oidGrupo || initialData?.grupo?.oidGrupo || ''
      : usuario.grupo?.oidGrupo || '';

    const data = {
      denominacion: initialData.denominacion || '',
      descripcion: initialData.descripcion || '',
      fechaIncorporacion: initialData.fechaIncorporacion || '',
      montoInvertido: initialData.montoInvertido || '',
      oidGrupo: grupoId ? String(grupoId) : '',
      activo: initialData.activo ?? true
    };

    setFormData(data);
    originalData.current = { ...data };
  }, [initialData, esAdmin, usuario.grupo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.denominacion.trim()) newErrors.denominacion = 'La denominación es obligatoria';
    if (esAdmin && !formData.oidGrupo) newErrors.oidGrupo = 'Debe seleccionar un grupo';
    if (formData.montoInvertido && formData.montoInvertido < 0) newErrors.montoInvertido = 'El monto no puede ser negativo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const dataToSubmit = { ...formData, oidGrupo: esAdmin ? formData.oidGrupo : usuario.grupo?.oidGrupo };
    onSubmit(dataToSubmit);
  };

  return (
    <form id={formId} className="equipo-form" onSubmit={handleSubmit} noValidate>
      <div className="equipo-form-grid">

        {/* DENOMINACIÓN */}
        <div className="equipo-form-field full-width">
          <label className="equipo-form-label">Denominación *</label>
          <input
            name="denominacion"
            type="text"
            className="equipo-input"
            value={formData.denominacion}
            onChange={handleChange}
            disabled={disabled.denominacion}
          />
          {errors.denominacion && <span className="equipo-form-error">{errors.denominacion}</span>}
        </div>

        {/* DESCRIPCIÓN */}
        <div className="equipo-form-field full-width">
          <label className="equipo-form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="equipo-input equipo-textarea"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            disabled={disabled.descripcion}
          />
        </div>

        {/* FECHA */}
        <div className="equipo-form-field">
          <label className="equipo-form-label">Fecha</label>
          <input
            type="date"
            name="fechaIncorporacion"
            className="equipo-input"
            value={formData.fechaIncorporacion ? formData.fechaIncorporacion.split('T')[0] : ''}
            onChange={handleChange}
            disabled={disabled.fechaIncorporacion}
          />
        </div>

        {/* MONTO */}
        <div className="equipo-form-field">
          <label className="equipo-form-label">Monto</label>
          <input
            type="number"
            name="montoInvertido"
            className="equipo-input"
            value={formData.montoInvertido}
            onChange={handleChange}
            min="0"
            step="0.01"
            disabled={disabled.montoInvertido}
          />
          {errors.montoInvertido && <span className="equipo-form-error">{errors.montoInvertido}</span>}
        </div>

        {/* GRUPO y ACTIVO (solo admin) */}
        {esAdmin && (
          <>
            <div className="equipo-form-field full-width">
              <label className="equipo-form-label">Grupo *</label>
              <select
                name="oidGrupo"
                className="equipo-input"
                value={formData.oidGrupo}
                onChange={handleChange}
                disabled={disabled.oidGrupo}
              >
                <option value="">-- Seleccione un grupo --</option>
                {grupos.map(g => (
                  <option key={g.oidGrupo} value={g.oidGrupo}>{g.sigla}</option>
                ))}
              </select>
              {errors.oidGrupo && <span className="equipo-form-error">{errors.oidGrupo}</span>}
            </div>

            <div className="equipo-form-field">
              <label className="equipo-form-label">Activo</label>
              <span>{formData.activo ? 'Sí' : 'No'}</span>
            </div>
          </>
        )}

      </div>
    </form>
  );
};

export default EquipoForm;