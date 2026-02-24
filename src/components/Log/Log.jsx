//Este es el "esqueleto" de los formularios del Log (LogIn y SingUp)

import './Log.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Log({ children, isLogin, titulo }) {
  const [animating, setAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state?.from) {
      setAnimationClass('animate__animated animate__flipInY');
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setAnimationClass('');
      }, 1000);
    }
  }, [location]);

  const handleToggle = () => {
    setAnimationClass('animate__animated animate__flipOutY');
    setAnimating(true);

    setTimeout(() => {
      const targetRoute = isLogin ? "/register" : "/login";
      navigate(targetRoute, { state: { from: isLogin ? 'login' : 'register' } });
    }, 800);
  };

  const navButtonLabel = isLogin ? "Ir a Registrarse" : "Ir a Iniciar Sesión";

  return (
    <div
      className={`form ${animationClass}`}
      id={isLogin ? 'loginContainer' : 'singUpContainer'}
    >
      <div className={`form-content ${animating ? 'content-animating' : ''}`}>

        {/* Header: botón de navegación alineado a la izquierda del título */}
        <div className="logHeader">
          {/*<button
            className="botonCambiarLog"
            onClick={handleToggle}
            type="button"
            disabled={animating}
          >
          
            {navButtonLabel}
          </button>
          */}
          <h1 className="txt">{titulo}</h1>
        </div>

        {children}
      </div>
    </div>
  );
}