import React, { useState, useEffect } from 'react';
import './MemoriaForm.css';
import { obtenerUsuario } from '../../config/permissions';

const MemoriaForm = ({
  formId,
  initialData = null,
  onSubmit,
  grupos = [],
  viewMode = false,
}) => {

  const usuario = obtenerUsuario();
  const esAdmin = usuario.role === 'ADMINISTRADOR';

  const isReadOnly = viewMode;

  const [formData, setFormData] = useState({
    anio: new Date().getFullYear(),
    oidGrupo: esAdmin ? '' : '',
  });

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      anio: initialData.anio || new Date().getFullYear(),
      oidGrupo: initialData.grupo?.oidGrupo ? String(initialData.grupo.oidGrupo) : '',
    });
  }, [initialData]);

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (viewMode) return;
    onSubmit(formData);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="memoria-form">
      <div className="memoria-form-grid">

        {/* AÑO */}
        <div className="memoria-form-field full-width">
          <label className="memoria-form-label">
            Año <span className="req">*</span>
          </label>
          <input
            className="memoria-input"
            type="number"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            disabled={isReadOnly}
            readOnly={isReadOnly}
            min="2000"
            max="2100"
            required
          />
        </div>

        {/* GRUPO (solo admin) */}
        {esAdmin && (
          <div className="memoria-form-field full-width">
            <label className="memoria-form-label">
              Grupo <span className="req">*</span>
            </label>

            {isReadOnly ? (
              <input
                className="memoria-input"
                type="text"
                value={initialData?.grupo?.sigla || ''}
                disabled
              />
            ) : (
              <select
                name="oidGrupo"
                className="memoria-select"
                value={formData.oidGrupo}
                onChange={handleChange}
                required
              >
                <option value="">-- Seleccione un grupo --</option>
                {grupos.map(g => (
                  <option key={g.oidGrupo} value={g.oidGrupo}>
                    {g.sigla}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

      </div>
    </form>
  );
};

export default MemoriaForm;