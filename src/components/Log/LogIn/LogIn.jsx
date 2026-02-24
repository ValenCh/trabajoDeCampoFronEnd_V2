import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Log from '../Log.jsx';
import Alerta from '../../Alertas/Alertas.jsx';

export default function Login({ setUsuario }) {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const enviarDatos = async (evento) => {
    evento.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const datosUsuario = { 
          email: email,
          role: data.role || "Integrante",
          grupo: data.grupo || null,
          token: data.token,
          loggedIn: true
        };
        
        localStorage.setItem("usuario", JSON.stringify(datosUsuario));
        setUsuario(datosUsuario); 
        navigate("/home");
      } else {
        setAlert({
          type: 'error',
          title: 'Error de Inicio de Sesión',
          message: data?.message || 'Credenciales incorrectas'
        });
      }

    } catch (error) { 
      setAlert({
        type: 'advertencia',
        title: 'Error de Conexión',
        message: `No se pudo conectar con el servidor. Error: ${error.message}`
      });
    }    
  };

  useEffect(() => {
    if (alert && alert.type === 'advertencia') {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <Log isLogin={true} titulo="Iniciar Sesión">
      <form onSubmit={enviarDatos} className='formularioLogin'>
        <label htmlFor='login-email' className='formLabel'>
          <span>Email:</span>
          <input
            type='email'
            id='login-email'
            placeholder='example@mail.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label htmlFor='login-password' className='formLabel'> 
          <span>Contraseña:</span>
          <input
            type='password'
            id='login-password'
            placeholder='Contraseña'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          /> 
        </label>

        <div className='boton'>
          <button type="submit" className='botonIniciarSesion'>Iniciar Sesión</button>
        </div>
      </form>

      {alert && (
        <Alerta
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
          onAccept={() => setAlert(null)}
        />
      )}
    </Log>
  );
}