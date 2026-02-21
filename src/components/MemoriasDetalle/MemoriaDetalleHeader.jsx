import React from 'react';
import { useNavigate } from 'react-router-dom';

const MemoriaDetalleHeader = ({ memoria, onExportar }) => {
  const navigate = useNavigate();

  return (
    <div className="memoria-detalle-header">
      <button className="btn-volver" onClick={() => navigate('/memorias')}>
        <i className="fa-solid fa-arrow-left" /> Volver
      </button>

      <div className="memoria-detalle-info">
        <h1 className="memoria-detalle-title">Memoria {memoria?.anio}</h1>
        <span className="memoria-detalle-grupo">{memoria?.nombreGrupo}</span>
      </div>

    </div>
  );
};

export default MemoriaDetalleHeader;
