import React, { useState } from 'react';
import './SubNavPersonal.css';

const SubNavPersonal = ({ onCategorySelect, selectedCategory }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const categorias = [
        { id: 'investigadores', label: 'Investigadores', icon: 'fa-microscope' },
        { id: 'profesionales', label: 'Profesionales', icon: 'fa-user-tie' },
        { id: 'tecnico', label: 'Técnico/Administrativo/Apoyo', icon: 'fa-screwdriver-wrench' },
        { id: 'becarios', label: 'Becarios/Personal en formación', icon: 'fa-graduation-cap', hasSubmenu: true }
    ];

    const subcategoriasBecarios = [
        { id: 'pasantes', label: 'Pasantes' },
        { id: 'doctorado', label: 'Doctorado' },
        { id: 'becarios-alumnos', label: 'Becarios Alumnos' },
        { id: 'becario-graduado', label: 'Becario Graduado' },
        { id: 'maestria', label: 'Maestría / Especialización' },
        { id: 'proyectos-finales', label: 'Proyectos Finales y Tesinas / Tesis de Posgrado' }
    ];

    const handleCategoryClick = (categoriaId) => {
        if (categoriaId === 'becarios') {
            setShowDropdown(!showDropdown);
        } else {
            setShowDropdown(false);
            onCategorySelect(categoriaId);
        }
    };

    const handleSubcategoryClick = (subcategoriaId) => {
        onCategorySelect(subcategoriaId);
    };

    return (
        <div className="subnav-personal-vertical">
            <ul className="subnav-list">
                {categorias.map((categoria) => (
                    <li key={categoria.id} className="subnav-list-item">
                        <button
                            className={`subnav-button ${selectedCategory === categoria.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(categoria.id)}
                        >
                            <i className={`fa-solid ${categoria.icon}`}></i>
                            <span>{categoria.label}</span>
                            {categoria.hasSubmenu && (
                                <i className={`fa-solid fa-chevron-down subnav-chevron ${showDropdown ? 'rotated' : ''}`}></i>
                            )}
                        </button>

                        {/* Submenú para Becarios */}
                        {categoria.id === 'becarios' && (
                            <ul className={`subnav-submenu ${showDropdown ? 'expanded' : ''}`}>
                                {subcategoriasBecarios.map((sub) => (
                                    <li key={sub.id}>
                                        <button
                                            className={`subnav-submenu-button ${selectedCategory === sub.id ? 'active' : ''}`}
                                            onClick={() => handleSubcategoryClick(sub.id)}
                                        >
                                            {sub.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubNavPersonal;