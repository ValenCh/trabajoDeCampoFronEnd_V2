import './Sidebar.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Secciones } from './Secciones/Secciones.jsx';
import SubNavPersonal from './SubNavPersonal/SubNavPersonal.jsx';
import Alerta from '../Alertas/Alertas.jsx';

const Sidebar = ({ onLogOut }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [alert, setAlert] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); 
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showSubNav, setShowSubNav] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [usuario, setUsuario] = useState({
        role: null,
        grupo: null,
        email: null
    });

    const isSidebarExpanded = isExpanded || isMobileOpen;

    // Cargar datos del usuario
    useEffect(() => {
        const datosUsuario = localStorage.getItem("usuario");
        if (datosUsuario) {
            const parsedData = JSON.parse(datosUsuario);
            setUsuario({
                role: parsedData.role || null,
                grupo: parsedData.grupo || null,
                email: parsedData.email || 'Sin email'
            });
        }
    }, []);

    // Cerrar mobile cuando cambia la ruta
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    // Cerrar SubNav cuando se colapsa
    useEffect(() => {
        if (!isSidebarExpanded) {
            setShowSubNav(false);
        }
    }, [isSidebarExpanded]);

    const handlePersonalClick = (e) => {
        e.preventDefault();
        setShowSubNav(!showSubNav);
    };

    const handleCloseSubNav = () => {
        setShowSubNav(false);
        setSelectedCategory(null);
    };

    const manejarLogout = () => {
        localStorage.removeItem("usuario");
        if (onLogOut) onLogOut();
        navigate("/login");
    };

    const handleLogoutFromPerfil = () => {
        setAlert({
            type: 'advertencia',
            title: 'Atención',
            message: '¿Desea cerrar sesión?'
        });
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    const handleCategorySelect = (categoryId) => {
        let path = "/personas";

        switch (categoryId) {
            case "investigadores":
                path = "/personas/investigadores";
                break;
            case "personal":
                path = "/personas/personal";
                break;
            case "consejo":
                path = "/personas/integrantesConsejoEducativo";
                break;
            case "becarios":
                path = "/personas/becarios";
                break;
            default:
                path = "/personas";
        }

        navigate(path);
        setShowSubNav(false);
        setSelectedCategory(categoryId);
    };

    return (
        <>
            {/* Botón hamburguesa */}
            <button 
                className={`sidebar-toggle ${isMobileOpen ? 'active' : ''}`}
                onClick={toggleMobileSidebar}
                aria-label="Toggle sidebar"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Backdrop mobile */}
            {isMobileOpen && (
                <div 
                    className="sidebar-backdrop" 
                    onClick={closeMobileSidebar}
                />
            )}

            <aside 
                className={`sidebar ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'} ${isMobileOpen ? 'sidebar-mobile-open' : ''}`}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                {/* HEADER */}
                <div className="sidebar-header">
                    {isSidebarExpanded ? (
                        <div className="sidebar-profile">                            
                            <div className="profile-avatar">    
                                <i className="fa-solid fa-user"></i>
                            </div>                            
                            <div className="profile-info">
                                <span className="profile-name">
                                    {usuario.email}
                                </span>

                                <span className="profile-group">
                                    {usuario.grupo?.nombreGrupo || "Sin grupo"}
                                </span>

                                <span className="profile-role">
                                    {usuario.role || 'Usuario'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-avatar-collapsed">
                            <i className="fa-solid fa-user"></i>
                        </div>
                    )}
                </div>

                {/* NAV */}
                <nav className="sidebar-nav">
                    <Secciones 
                        closeMenu={closeMobileSidebar} 
                        onPersonalClick={handlePersonalClick} 
                        isPersonalActive={showSubNav}
                        isExpanded={isSidebarExpanded}
                    />

                    {showSubNav && isSidebarExpanded && (
                        <SubNavPersonal 
                            onCategorySelect={handleCategorySelect}
                            selectedCategory={selectedCategory}
                            onClose={handleCloseSubNav}
                        />
                    )}
                </nav>

                {/* FOOTER */}
                <div className="sidebar-footer">
                    <button 
                        onClick={handleLogoutFromPerfil}
                        className="logout-button"
                        title="Cerrar sesión"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        {isSidebarExpanded && <span>Cerrar sesión</span>}
                    </button>
                </div>
            </aside>

            {/* ALERTA */}
            {alert && (
                <Alerta
                    type={alert.type}
                    title={alert.title}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                    onCancel={() => setAlert(null)}
                    onAccept={() => { 
                        setAlert(null); 
                        manejarLogout(); 
                    }}
                />
            )}
        </>
    );
};

export default Sidebar;