import React, { useEffect, useRef, useState } from 'react';
import './DocumentoForm.css';
import SubirArchivo from '../../assets/descargarArchivo.png';
import { obtenerUsuario } from '../../config/permissions';

const DocumentoForm = ({
  formId,
  initialData = null,
  onSubmit,
  grupos = [],
  disabled = {},
  viewMode = false,
  deleteMode = false
}) => {

  const usuario = obtenerUsuario();
  const esAdmin = usuario.role === 'ADMINISTRADOR';

  const fileInputRef = useRef(null);

  const isReadOnly = viewMode || deleteMode;
  const isDisabled = (field) => isReadOnly || disabled[field];

  const [formData, setFormData] = useState({
    titulo: '',
    autores: '',
    editorial: '',
    anio: '',
    oidGrupo: esAdmin ? '' : usuario.grupo?.oidGrupo || '',
    archivo: null
  });

  useEffect(() => {
    if (!initialData) return;

    const grupoId = esAdmin
      ? initialData.grupo?.oidGrupo || ''
      : usuario.grupo?.oidGrupo || '';

    setFormData(prev => ({
      ...prev,
      titulo:    initialData.titulo    || '',
      autores:   initialData.autores   || '',
      editorial: initialData.editorial || '',
      anio:      initialData.anio      || '',
      oidGrupo:  grupoId ? String(grupoId) : ''
    }));
  }, [initialData, esAdmin, usuario.grupo]);

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (isReadOnly) return;
    setFormData(prev => ({ ...prev, archivo: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (viewMode) return;
    const dataToSubmit = {
      ...formData,
      oidGrupo: esAdmin ? formData.oidGrupo : usuario.grupo?.oidGrupo
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="documento-form">
      <div className="documento-form-grid">

        {/* TITULO */}
        <div className="documento-form-field">
          <label className="documento-form-label">
            Título <span className="req">*</span>
          </label>
          <input
            className="documento-input"
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            disabled={isDisabled('titulo')}
            readOnly={isReadOnly}
          />
        </div>

        {/* AUTORES */}
        <div className="documento-form-field">
          <label className="documento-form-label">Autores</label>
          <input
            className="documento-input"
            type="text"
            name="autores"
            value={formData.autores}
            onChange={handleChange}
            disabled={isDisabled('autores')}
            readOnly={isReadOnly}
          />
        </div>

        {/* EDITORIAL */}
        <div className="documento-form-field">
          <label className="documento-form-label">Editorial</label>
          <input
            className="documento-input"
            type="text"
            name="editorial"
            value={formData.editorial}
            onChange={handleChange}
            disabled={isDisabled('editorial')}
            readOnly={isReadOnly}
          />
        </div>

        {/* AÑO */}
        <div className="documento-form-field">
          <label className="documento-form-label">Año</label>
          <input
            className="documento-input"
            type="number"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            disabled={isDisabled('anio')}
            readOnly={isReadOnly}
          />
        </div>

        {/* GRUPO (solo admin) */}
        {esAdmin && (
          <div className="documento-form-field">
            <label className="documento-form-label">Grupo</label>
            {isReadOnly ? (
              <input
                className="documento-input"
                type="text"
                value={initialData?.nombreGrupo || ''}
                disabled
              />
            ) : (
              <select
                name="oidGrupo"
                className="documento-input"
                value={formData.oidGrupo}
                onChange={handleChange}
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

        {/* ARCHIVO */}
        <div className="documento-form-field">
          <label className="documento-form-label">
            Archivo <span className="req">*</span>
          </label>
          <div
            className={`documento-upload-box ${isReadOnly ? 'disabled' : ''}`}
            onClick={() => {
              if (isReadOnly) return;
              fileInputRef.current.click();
            }}
            style={{
              pointerEvents: isReadOnly ? 'none' : 'auto',
              opacity:       isReadOnly ? 0.6    : 1,
              cursor:        isReadOnly ? 'not-allowed' : 'pointer'
            }}
          >
            <img src={SubirArchivo} alt="Subir archivo" />
            <span>{formData.archivo ? formData.archivo.name : 'Archivo'}</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isReadOnly}
            style={{ display: 'none' }}
          />
        </div>

      </div>
    </form>
  );
};

export default DocumentoForm;