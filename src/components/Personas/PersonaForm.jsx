import { useEffect, useState } from 'react';
import './PersonaForm.css';
import { obtenerUsuario, esAdministrador } from '../../config/permissions';

const PersonaForm = ({
  formId,
  tipoPersona,
  modo = 'crear',
  initialData = null,
  grupos = [],
  onSubmit,
}) => {

  const isReadOnly = modo === 'ver';
  const usuario    = obtenerUsuario();
  const esAdmin    = esAdministrador(usuario?.role);

  const getInitialState = () => ({
    nombre:              '',
    apellido:            '',
    horasSemanales:      '',
    tipoPersona:         tipoPersona,
    oidGrupo:            '',
    // Investigador
    categoriaUTN:        '',
    programaDeIncentivos:'',
    dedicacion:          '',
    gradoAcademico:      '',
    // Becario
    fuenteFinanciamiento:'',
    tipoBecario:         '',
    // Personal
    tipoPersonal:        '',
    // Consejo
    cargo:               ''
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (initialData) {
      setFormData({ ...getInitialState(), ...initialData, tipoPersona });
    } else {
      setFormData(getInitialState());
    }
  }, [initialData, tipoPersona]);

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    onSubmit(formData);
  };

  return (
    <form id={formId} className="persona-form" onSubmit={handleSubmit}>
      <div className="persona-form-grid">

        {/* ===== CAMPOS COMUNES ===== */}
        <div className="persona-form-field">
          <label className="persona-form-label">Nombre</label>
          <input
            className="persona-input"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isReadOnly}
          />
        </div>

        <div className="persona-form-field">
          <label className="persona-form-label">Apellido</label>
          <input
            className="persona-input"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            disabled={isReadOnly}
          />
        </div>

        <div className="persona-form-field">
          <label className="persona-form-label">Horas semanales</label>
          <input
            className="persona-input"
            type="number"
            name="horasSemanales"
            value={formData.horasSemanales}
            onChange={handleChange}
            disabled={isReadOnly}
          />
        </div>

        {/* ===== GRUPO (solo admin) ===== */}
        {esAdmin && (
          <div className="persona-form-field">
            <label className="persona-form-label">Grupo</label>
            <select
              className="persona-select"
              name="oidGrupo"
              value={formData.oidGrupo}
              onChange={handleChange}
              disabled={isReadOnly}
            >
              <option value="">Seleccione un grupo</option>
              {grupos.map(g => (
                <option key={g.oidGrupo} value={g.oidGrupo}>
                  {g.sigla} - {g.nombreGrupo}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ===== INVESTIGADOR ===== */}
        {formData.tipoPersona === 'Investigador' && (
          <>
            <div className="persona-form-field">
              <label className="persona-form-label">Categoría UTN</label>
              <input
                className="persona-input"
                name="categoriaUTN"
                value={formData.categoriaUTN}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            <div className="persona-form-field">
              <label className="persona-form-label">Programa de incentivos</label>
              <input
                className="persona-input"
                name="programaDeIncentivos"
                value={formData.programaDeIncentivos}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            <div className="persona-form-field">
              <label className="persona-form-label">Dedicación</label>
              <input
                className="persona-input"
                name="dedicacion"
                value={formData.dedicacion}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            <div className="persona-form-field">
              <label className="persona-form-label">Grado académico</label>
              <input
                className="persona-input"
                name="gradoAcademico"
                value={formData.gradoAcademico}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>
          </>
        )}

        {/* ===== BECARIO ===== */}
        {formData.tipoPersona === 'Becario' && (
          <>
            <div className="persona-form-field">
              <label className="persona-form-label">Fuente de financiamiento</label>
              <input
                className="persona-input"
                name="fuenteFinanciamiento"
                value={formData.fuenteFinanciamiento}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>

            <div className="persona-form-field">
              <label className="persona-form-label">Tipo de becario</label>
              <select
                className="persona-select"
                name="tipoBecario"
                value={formData.tipoBecario}
                onChange={handleChange}
                disabled={isReadOnly}
              >
                <option value="">Seleccione</option>
                <option value="Doctorado">Doctorado</option>
                <option value="MaestriaYOEspecializacion">Maestría o Especialización</option>
                <option value="BecarioGraduado">Becario Graduado</option>
                <option value="BecarioAlumno">Becario Alumno</option>
                <option value="Pasante">Pasante</option>
                <option value="ProyectoFinalYTesinaDeGradoYOTrabajoFinalYTesisDePosgrado">
                  Proyecto Final / Tesis
                </option>
              </select>
            </div>
          </>
        )}

        {/* ===== PERSONAL ===== */}
        {formData.tipoPersona === 'Personal' && (
          <div className="persona-form-field">
            <label className="persona-form-label">Tipo de personal</label>
            <select
              className="persona-select"
              name="tipoPersonal"
              value={formData.tipoPersonal}
              onChange={handleChange}
              disabled={isReadOnly}
            >
              <option value="">Seleccione</option>
              <option value="PersonalProfesional">Personal Profesional</option>
              <option value="PersonalTecnicoAdministrativoYDeApoyo">
                Personal Técnico, Administrativo y de Apoyo
              </option>
            </select>
          </div>
        )}

        {/* ===== CONSEJO EDUCATIVO ===== */}
        {formData.tipoPersona === 'IntegranteConsejoEducativo' && (
          <div className="persona-form-field">
            <label className="persona-form-label">Cargo</label>
            <input
              className="persona-input"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>
        )}

      </div>
    </form>
  );
};

export default PersonaForm;