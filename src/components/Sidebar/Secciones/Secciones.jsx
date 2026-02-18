import { Link } from "react-router-dom";

export const Secciones = ({ closeMenu, onPersonalClick, isPersonalActive, isExpanded }) => {
    
    const handleClick = () => {
        if (closeMenu) {
            closeMenu();
        }
    };

    const handlePersonalClick = (e) => {
        if (onPersonalClick) {
            onPersonalClick(e);
        }
    };

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    return (
        <ul className="navbar-nav secciones">

            <li className="nav-item">
                <Link
                    className='homeLink' 
                    to={"/"} 
                    onClick={closeMobileSidebar}
                    data-tooltip="Inicio"
                >
                        <i className="fa-solid fa-house"></i>
                        <span>Inicio</span>
                </Link>

            </li>

            <li className="nav-item">
                <Link 
                    className="nav-link" 
                    to={"/documentos"}
                    onClick={handleClick}
                    data-tooltip="Documentos"
                >
                    <i className="fa-solid fa-file-lines"></i>
                    <span>Documentos</span>
                </Link>
            </li> 

            <li className={`nav-item ${isPersonalActive ? 'active' : ''}`}>
                <a 
                    className="nav-link" 
                    href="#"
                    onClick={handlePersonalClick}
                    data-tooltip="Personal"
                >
                    <i className="fa-solid fa-users"></i>
                    <span>Personal</span>
                </a>
            </li>

            <li className="nav-item">
                <Link 
                    className="nav-link" 
                    to={"/grupos"}
                    onClick={handleClick}
                    data-tooltip="Grupos"
                >
                    <i className="fa-solid fa-user-group"></i>
                    <span>Grupos</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link 
                    className="nav-link" 
                    to={"/equipos"}
                    onClick={handleClick}
                    data-tooltip="Equipo"
                >
                    <i className="fa-solid fa-toolbox"></i>
                    <span>Equipo</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link 
                    className="nav-link" 
                    to={"/memorias"}
                    onClick={handleClick}
                    data-tooltip="Memorias"
                >
                    <i className="fa-solid fa-file-lines"></i>
                    <span>Memorias</span>
                </Link>
            </li>



        </ul>
    );
};