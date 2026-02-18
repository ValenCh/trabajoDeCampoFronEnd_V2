import './Sidebar.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
//import Logo from '../../assets/logoUTN.png';
import { Secciones } from './Secciones/Secciones.jsx';
import SubNavPersonal from './SubNavPersonal/SubNavPersonal.jsx';
import Alerta from '../Alertas/Alertas.jsx';

const Sidebar = ({ onLogOut }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [alert, setAlert] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // Estado de expansión
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showSubNav, setShowSubNav] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Datos del usuario
    const [usuario, setUsuario] = useState({
        rol: 'Director',
        grupo: 'Grupo1',
        email: 'correo@mail.com'
    });

    // Cargar datos del usuario
    useEffect(() => {
        const datosUsuario = localStorage.getItem("usuario");
        if (datosUsuario) {
            const parsedData = JSON.parse(datosUsuario);
            setUsuario({
                rol: parsedData.role || null,
                grupo: parsedData.group || null,
                email: parsedData.email || 'Error: no email'
            });
        }
    }, []);

    // Función para manejar el clic en Personal
    const handlePersonalClick = (e) => {
        e.preventDefault();
        setShowSubNav(!showSubNav);
    };

    // Función para cerrar el SubNav
    const handleCloseSubNav = () => {
        setShowSubNav(false);
        setSelectedCategory(null);
    };

    // Cerrar mobile sidebar cuando cambie la ruta
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    // Cerrar SubNav cuando se colapsa el sidebar
    useEffect(() => {
        if (!isExpanded) {
            setShowSubNav(false);
        }
    }, [isExpanded]);

    const manejarLogout = () => {
        localStorage.removeItem("usuario");
        if (onLogOut) {
            onLogOut();
        }
        navigate("/login");
    };

    const handleLogoutFromPerfil = () => {
        setAlert({
            type: 'advertencia',
            title: 'Atención',
            message: 'Desea cerrar sesión?'
        });
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    const handleCategorySelect = (categoryId) => {
        let path = "/personal";

        switch (categoryId) {
            case "investigadores":
                path = "/personal/investigadores";
                break;
            case "profesionales":
                path = "/personal/profesionales";
                break;
            case "tecnico":
                path = "/personal/tecnico-administrativo-apoyo";
                break;
            case "becarios":
                path = "/personal/becarios";
                break;
            case "pasantes":
                path = "/personal/becarios/pasantes";
                break;
            case "doctorado":
                path = "/personal/becarios/doctorado";
                break;
            case "becarios-alumnos":
                path = "/personal/becarios/alumnos";
                break;
            case "becario-graduado":
                path = "/personal/becarios/graduado";
                break;
            case "maestria":
                path = "/personal/becarios/maestria";
                break;
            case "proyectos-finales":
                path = "/personal/becarios/proyectos-finales";
                break;
            default:
                path = "/personal";
                break;
        }

        navigate(path);
        setShowSubNav(false);
        setSelectedCategory(categoryId);
    };

    return (
        <>
            {/* Botón hamburguesa para mobile */}
            <button 
                className={`sidebar-toggle ${isMobileOpen ? 'active' : ''}`}
                onClick={toggleMobileSidebar}
                aria-label="Toggle sidebar"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Backdrop para mobile */}
            {isMobileOpen && <div className="sidebar-backdrop" onClick={closeMobileSidebar}></div>}

            {/* Sidebar con estado de expansión */}
            <aside 
                className={`sidebar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'} ${isMobileOpen ? 'sidebar-mobile-open' : ''}`}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                {/* Header del sidebar con perfil */}
                <div className="sidebar-header">
                   {/* <Link className="sidebar-logo" to="/" onClick={closeMobileSidebar}>
                        <img src={Logo} alt="Logo UTN" className="logo-image" />
                    </Link>
                   */}
                    {isExpanded && (
                      
                        <div className="sidebar-profile">                            
                            <div className="profile-avatar">    
                                <i className="fa-solid fa-user"></i>
                            </div>                            
                            <div className="profile-info">
                                <span className="profile-name"><p>{usuario.email}</p></span>
                                <span className="profile-group">{usuario.grupo || ""}</span>
                                <span className="profile-role">{usuario.rol || 'Usuario'}</span>
                            </div>
                        </div>

                    )}

                    {!isExpanded && (
                        <div className="profile-avatar-collapsed">
                            <i className="fa-solid fa-user"></i>
                        </div>
                    )}
                </div>

                {/* Navegación */}
                <nav className="sidebar-nav">
                    <Secciones 
                        closeMenu={closeMobileSidebar} 
                        onPersonalClick={handlePersonalClick} 
                        isPersonalActive={showSubNav}
                        isExpanded={isExpanded}
                    />

                    {/* SubNav integrado - solo visible cuando está expandido */}
                    {showSubNav && isExpanded && (
                        <SubNavPersonal 
                            onCategorySelect={handleCategorySelect}
                            selectedCategory={selectedCategory}
                            onClose={handleCloseSubNav}
                        />
                    )}
                </nav>

                {/* Footer del sidebar */}
                <div className="sidebar-footer">
                    <button 
                        onClick={handleLogoutFromPerfil}
                        className="logout-button"
                        title="Cerrar sesión"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        {isExpanded && <span>Cerrar sesión</span>}
                    </button>
                </div>

                {/* Alerta de confirmación */}
                {alert && (
                    <Alerta
                        type={alert.type}
                        title={alert.title}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                        onCancel={() => setAlert(null)}
                        onAccept={() => { setAlert(null); manejarLogout(); }}
                    />
                )}
            </aside>
        </>
    );
};

export default Sidebar;