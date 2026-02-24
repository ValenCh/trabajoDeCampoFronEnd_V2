import { Link } from "react-router-dom";

export const Secciones = ({ closeMenu, onPersonalClick, isPersonalActive, isExpanded }) => {
    
    const usuario = JSON.parse(localStorage.getItem("usuario"));

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
                    className='homeLink' 
                    to={"/"} 
                    onClick={handleClick}
                    data-tooltip="Inicio"
                >
                    <i className="fa-solid fa-house"></i>
                    {isExpanded && <span>Inicio</span>}
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
                    {isExpanded && <span>Documentos</span>}
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
                    {isExpanded && <span>Personal</span>}
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
                    {isExpanded && <span>Grupos</span>}
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
                    {isExpanded && <span>Equipo</span>}
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
                    {isExpanded && <span>Memorias</span>}
                </Link>
            </li>

            {/* 🔐 SOLO ADMINISTRADOR */}
            {usuario?.role === "ADMINISTRADOR" && (
                <li className="nav-item">
                    <Link 
                        className="nav-link" 
                        to={"/usuarios"}
                        onClick={handleClick}
                        data-tooltip="Usuarios"
                    >
                        <i className="fa-solid fa-users-gear"></i>
                        {isExpanded && <span>Usuarios</span>}
                    </Link>
                </li>
            )}

        </ul>
    );
};