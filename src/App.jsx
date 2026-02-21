import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LogIn from "./components/Log/LogIn/LogIn.jsx";
import SingUp from "./components/Log/SingUp/SingUp.jsx";
import Home from "./components/Home/Home";
import MainLayout from "./components/MainLayout/MainLayout.jsx";
import GruposPage from "./pages/GruposPage.jsx";
import DocumentosPage from "./pages/DocumentosPage.jsx";
import IntegrantesCEPage from './pages/IntegrantesCEPage';
import MemoriaDetallePage from './pages/MemoriaDetallePage';
import './App.css'
import EquiposPage from "./pages/EquiposPage.jsx";
import BecariosPage from "./pages/BecariosPage.jsx";
import InvestigadoresPage from "./pages/InvestigadoresPage.jsx";
import PersonalPage from "./pages/PersonalPage.jsx";
import MemoriasPage from "./pages/MemoriasPage.jsx";

// Componente contenedor de la aplicación que maneja las rutas y el estado del usuario
function ContenedorApp({ usuario, setUsuario }) {
  const ubicacion = useLocation();
  // Verifica si la ubicación actual es LogIn o SingUp (para ver el fondo adecuado)
  const estaEnLog = ubicacion.pathname === "/login" || ubicacion.pathname === "/register"; 

  return (
    // Contenedor principal de la aplicación con fondo condicional
    <div className={estaEnLog ? "bg-login" : "bg-main"}>
      {/* Rutas que NO necesitan MainLayout (Login, Register) */}
      {estaEnLog ? (
        <div className="App-body">
          <Routes>
            {/* Ruta para LogIn */}
            <Route
              path="/login"
              element={
                !usuario ? <LogIn setUsuario={setUsuario} /> : <Navigate to="/home" />
              }
            />
          
            <Route
              path="/register"
              element={ !usuario ? <SingUp /> : <Navigate to="/home" /> }
            />
          </Routes>
        </div>
      ) : (
        /* Rutas que SÍ necesitan MainLayout (con Sidebar) */
        usuario && (
          <MainLayout onLogOut={() => setUsuario(null)}>
            <Routes>
              {/* Ruta inicial: si no está logueado, va a login, si sí, redirige al home */}
              <Route
                path="/"
                element={<Navigate to="/home" />}
              />
            
              {/* Ruta protegida para Home */}
              <Route
                path="/home"
                element={<Home usuario={usuario} />}
              />

              {/* Ruta protegida para Grupos */}
              <Route
                path="/grupos"
                element={<GruposPage />}
              />

              {              }
              <Route 
                path="/equipos" 
                element={<EquiposPage />} 
                />

              <Route 
                path="/documentos" 
                element={<DocumentosPage />} 
                />

              <Route 
                path="/personas/becarios" 
                element={<BecariosPage />} 
                />

              <Route 
                path="/personas/investigadores" 
                element={<InvestigadoresPage />} 
                />
              
              <Route 
                path="/personas/personal" 
                element={<PersonalPage />} 
                />

              <Route 
                path="/personas/integrantesConsejoEducativo" 
                element={<IntegrantesCEPage />} 
                />

              <Route 
                path="/memorias" 
                element={<MemoriasPage />} 
                />


              <Route path="/memorias/:oidMemoria" element={<MemoriaDetallePage />} />
              {/* Aquí irían las demás rutas protegidas */}
              {/* Ejemplo:
              <Route path="/documentacion" element={<Documentacion />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/equipo" element={<Equipo />} />
              */}
            </Routes>
          </MainLayout>
        )
      )}

      {/* Redirección si no está autenticado */}
      {!usuario && !estaEnLog && <Navigate to="/login" />}
    </div>
  );
}

// Componente principal de la aplicación
export default function App() {
  const [usuario, setUsuario] = useState(null);
  
  // Verificar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  // Función mejorada para manejar el login y guardar en localStorage
  const manejarLogin = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
  };

  // Función mejorada para manejar el logout y limpiar localStorage
  const manejarLogout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <BrowserRouter>
      <ContenedorApp usuario={usuario} setUsuario={manejarLogin} />
    </BrowserRouter>
  );
}