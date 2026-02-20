import React from 'react';
import './SubNavPersonal.css';

const SubNavPersonal = ({ onCategorySelect, selectedCategory }) => {

  const categorias = [
    { id: 'investigadores', label: 'Investigadores', icon: 'fa-microscope' },
    { id: 'personal', label: 'Personal', icon: 'fa-user-tie' },
    { id: 'consejo', label: 'Consejo Educativo', icon: 'fa-landmark' },
    { id: 'becarios', label: 'Becarios', icon: 'fa-graduation-cap' }
  ];

  return (
    <div className="subnav-personal-vertical">
      <ul className="subnav-list">
        {categorias.map(cat => (
          <li key={cat.id} className="subnav-list-item">
            <button
              className={`subnav-button ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategorySelect(cat.id)}
            >
              <i className={`fa-solid ${cat.icon}`}></i>
              <span>{cat.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubNavPersonal;