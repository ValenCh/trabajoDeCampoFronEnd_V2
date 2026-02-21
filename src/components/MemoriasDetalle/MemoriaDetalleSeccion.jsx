import React from 'react';

/**
 * MemoriaDetalleSeccion
 *
 * Componente genérico reutilizable para mostrar los recursos de una memoria.
 * Muestra dos tablas: los que ya están en la memoria y los disponibles para agregar.
 *
 * Props:
 *  - columnas: array de { key, label } para las columnas de la tabla
 *  - enMemoria: array de objetos ya agregados
 *  - disponibles: array de objetos disponibles para agregar
 *  - keyField: campo que se usa como key única (ej: 'oidPersona')
 *  - onAgregar: función(id) → agrega el recurso
 *  - onQuitar: función(id) → quita el recurso
 *  - puedeGestionar: boolean
 *  - emptyMessage: mensaje cuando no hay datos
 */
const MemoriaDetalleSeccion = ({
  columnas,
  enMemoria,
  disponibles,
  keyField,
  onAgregar,
  onQuitar,
  puedeGestionar,
  emptyMessage = 'Sin datos',
}) => {

  const idsEnMemoria = new Set(enMemoria.map(item => item[keyField]));

  const disponiblesFiltrados = disponibles.filter(
    item => !idsEnMemoria.has(item[keyField])
  );

  return (
    <div className="memoria-seccion">

      {/* Tabla: en la memoria */}
      <div className="memoria-seccion-tabla">
        <h3>En la memoria</h3>
        <table className="memoria-table">
          <thead>
            <tr>
              {columnas.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
              {puedeGestionar && <th>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {enMemoria.length === 0
              ? (
                <tr>
                  <td colSpan={columnas.length + (puedeGestionar ? 1 : 0)}>
                    {emptyMessage}
                  </td>
                </tr>
              )
              : enMemoria.map(item => (
                <tr key={item[keyField]}>
                  {columnas.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(item) : item[col.key] ?? '-'}
                    </td>
                  ))}
                  {puedeGestionar && (
                    <td>
                      <button
                        className="btn-quitar"
                        onClick={() => onQuitar(item[keyField])}
                        title="Quitar"
                      >
                        <i className="fa-solid fa-minus" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Tabla: disponibles (solo si puede gestionar) */}
      {puedeGestionar && (
        <div className="memoria-seccion-disponibles">
          <h3>Disponibles</h3>
          <table className="memoria-table">
            <thead>
              <tr>
                {columnas.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Agregar</th>
              </tr>
            </thead>
            <tbody>
              {disponiblesFiltrados.length === 0
                ? (
                  <tr>
                    <td colSpan={columnas.length + 1}>
                      No hay más para agregar
                    </td>
                  </tr>
                )
                : disponiblesFiltrados.map(item => (
                  <tr key={item[keyField]}>
                    {columnas.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(item) : item[col.key] ?? '-'}
                      </td>
                    ))}
                    <td>
                      <button
                        className="btn-agregar"
                        onClick={() => onAgregar(item[keyField])}
                        title="Agregar"
                      >
                        <i className="fa-solid fa-plus" />
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default MemoriaDetalleSeccion;
