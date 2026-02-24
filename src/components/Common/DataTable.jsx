import React from 'react';
import './DataTable.css';

/**
 * DataTable - Componente de tabla reutilizable
 *
 * Props:
 *  - columns: array de objetos con estructura:
 *      [{ key: 'id', label: 'ID', width: '12%', className: 'col-id' }]
 *      - key: nombre del campo en los datos
 *      - label: texto a mostrar en el header
 *      - width: ancho opcional de la columna
 *      - className: clase CSS opcional para la columna
 *      - render: función opcional para renderizado personalizado (row, value) => JSX
 *
 *  - data: array de objetos (los datos de las filas)
 *
 *  - actions: función que recibe (row) y retorna JSX con los botones de acción
 *      Ejemplo: (row) => <button onClick={() => ver(row)}>Ver</button>
 *
 *  - keyField: string (opcional) - campo a usar como key de React. Default: primera columna
 *
 *  - emptyMessage: string (opcional) - mensaje cuando no hay datos
 *
 *  - onRowClick: función opcional que se ejecuta al hacer click en una fila
 *
 *  - className: string (opcional) - clase adicional para el wrapper
 *
 *  - tableClassName: string (opcional) - clase adicional para la tabla
 */
const DataTable = ({
  columns = [],
  data = [],
  actions,
  keyField,
  emptyMessage = 'No se encontraron resultados',
  onRowClick,
  className = '',
  tableClassName = '',
}) => {
  const getRowKey = (row, index) => {
    if (keyField && row[keyField] !== undefined) return row[keyField];
    if (columns.length > 0 && row[columns[0].key] !== undefined) return row[columns[0].key];
    return index;
  };

  const renderCellValue = (row, column) => {
    const value = row[column.key];
    if (column.render && typeof column.render === 'function') return column.render(row, value);
    return value !== null && value !== undefined ? value : '—';
  };

  const totalColumns = columns.length + (actions ? 1 : 0);

  return (
    <div className={`data-table-wrapper ${className}`.trim()}>

      {/* Wrapper de scroll: único cambio estructural */}
      <div className="data-table-scroll">

        <table className={`data-table ${tableClassName}`.trim()}>
          <colgroup>
            {columns.map((col, idx) => (
              <col
                key={idx}
                className={col.className || ''}
                style={col.width ? { width: col.width } : undefined}
              />
            ))}
            {actions && <col className="col-acciones" />}
          </colgroup>

          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.label}</th>
              ))}
              {actions && <th>Acción</th>}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr className="data-table-empty-row">
                <td colSpan={totalColumns}>{emptyMessage}</td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={getRowKey(row, rowIndex)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'clickable-row' : ''}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>{renderCellValue(row, col)}</td>
                  ))}
                  {actions && <td>{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default DataTable;