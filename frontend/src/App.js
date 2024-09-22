import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import './App.css';

import Navbar from './components/Navbar';
import InicioSesion from './pages/InicioSesion';
import RegistroUsuario from './pages/RegistroUsuario';
import PaginaInicio from './pages/PaginaInicio';
import ConfiguracionCuenta from './pages/ConfiguracionCuenta';
import VistaAlbum from './pages/VistaAlbum';
import AlbumEdit from './pages/AlbumEdit';
import CargarImagen from './pages/CargarImagen';
import ExtracionTexto from './pages/ExtracionTexto';
import AuxNavBar from './components/AuxNavBar';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Router>
        <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </Router>
    </>
  );
}

function Layout({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation(); // Ahora está dentro de Router

  // Verifica si la ruta actual es de inicio de sesión o registro
  //const isAuthPage = location.pathname === '/inicio-sesion' || location.pathname === '/registro-usuario';
  const hideNavbarPaths = ["/inicio-sesion", "/registro-usuario"];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <AuxNavBar>
        <Routes>
          <Route path="/inicio-sesion" element={<InicioSesion setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/registro-usuario" element={<RegistroUsuario />} />
          <Route path="/pagina-inicio" element={<PaginaInicio showNavBar={true}/>} />
          <Route path="/configuracion-cuenta" element={<ConfiguracionCuenta showNavBar={true} />} />
          <Route path="/vista-album" element={<VistaAlbum showNavBar={true}/>} />
          <Route path="/editar-album" element={<AlbumEdit showNavBar={true}/>} />
          <Route path="/cargar-imagen" element={<CargarImagen showNavBar={true}/>} />
          <Route path="/extraccion-texto" element={<ExtracionTexto showNavBar={true}/>} />
              {/* Otras rutas que necesitan autenticación */}
          <Route path="*" element={<Navigate to="/inicio-sesion" />} />
          </Routes>

      </AuxNavBar>
    </>
  );
}

export default App;
