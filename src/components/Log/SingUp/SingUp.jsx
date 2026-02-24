import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Log from '../Log.jsx';
import Alerta from '../../Alertas/Alertas.jsx';

export default function Register() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const enviarDatos = async (evento) => {
    evento.preventDefault();

    if (password !== confirmarPassword) {
      setAlert({
        type: 'info',
        title: 'Contraseñas No Coinciden',
        message: 'Por favor, inténtelo de nuevo.'
      });
      return;
    }

    if (password.length < 6) {
      setAlert({
        type: 'info',
        title: 'Contraseña Demasiado Corta',
        message: 'La contraseña debe tener al menos 6 caracteres.'
      });
      return;
    }

    try {
      // Usamos la URL completa para evitar problemas con el proxy si falla
      const response = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      // console.log("✅ Respuesta recibida - Status:", response.status);

      // ⭐ SOLUCIÓN: Primero obtener como texto
      const data = await response.text();
      // console.log("📝 Respuesta del servidor:", data);

      if (response.ok) {
        setAlert({
          type: 'exito',
          title: 'Registro Exitoso',
          message: 'Redirigiendo al inicio de sesión...'
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setAlert({
          type: 'error',
          title: 'Error de Registro',
          message: data || 'No se pudo registrar'
        });
      }

    } catch (error) {
      //console.error("💥 Error:", error);
      setAlert({
        type: 'advertencia',
        title: 'Error de Conexión',
        message: `No se pudo conectar con el servidor. Error: ${error.message}`
      });
    }
  };

  useEffect(() => {
    if (alert && (alert.type === 'advertencia' || alert.type === 'exito')) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <Log isLogin={false}>
      <h1 className='txt'>Registrarse</h1>

      <form onSubmit={enviarDatos} className='formularioLogin'>
        <label htmlFor='register-email' className='formLabel'>
          <span>Email:</span>
          <input
            type='email'
            id='register-email'
            placeholder='example@mail.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label htmlFor='register-password' className='formLabel'> 
          <span>Contraseña:</span>
          <input
            type='password'
            id='register-password'
            placeholder='Mínimo 6 caracteres'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          /> 
        </label>

        <label htmlFor='register-confirmar-password' className='formLabel'> 
          <span>Confirmar Contraseña:</span>
          <input
            type='password'
            id='register-confirmar-password'
            placeholder='Repite tu contraseña'
            value={confirmarPassword}
            onChange={e => setConfirmarPassword(e.target.value)}
            required
          /> 
        </label>

        <div className='boton'>
          <button type="submit" className='botonIniciarSesion'>Registrarse</button>
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