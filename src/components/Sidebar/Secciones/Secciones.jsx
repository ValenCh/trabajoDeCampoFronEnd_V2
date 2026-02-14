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

    return (
        <ul className="navbar-nav secciones">
            <li className="nav-item">
                <Link 
                    className="nav-link" 
                    to={"/documentacion"}
                    onClick={handleClick}
                    data-tooltip="Documentación"
                >
                    <i className="fa-solid fa-file-lines"></i>
                    <span>Documentación</span>
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
                    to={"/equipo"}
                    onClick={handleClick}
                    data-tooltip="Equipo"
                >
                    <i className="fa-solid fa-people-group"></i>
                    <span>Equipo</span>
                </Link>
            </li>
        </ul>
    );
};