import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../session";

function Navbar(location) {
    const navigate = useNavigate();
    
  const handleLogout = (e) => {
    logout();
    navigate("/inicio-sesion");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
          <i className="bi bi-camera"></i> PHOTOBUCKET
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-2">
                <NavLink to="/pagina-inicio" className="nav-link">
                <i className="bi bi-house-door-fill"></i> Home
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink to="/configuracion-cuenta" className="nav-link">
                  <i className="bi bi-gear-fill"></i> Settings
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink to="/vista-album" className="nav-link">
                  <i className="bi bi-eye"></i> Watch
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink to="/editar-album" className="nav-link">
                  <i className="bi bi-pencil-square"></i> Edit
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink to="/cargar-imagen" className="nav-link">
                  <i className="bi bi-upload"></i> Upload
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink to="/extraccion-texto" className="nav-link">
                  <i className="bi bi-journal-text"></i> Text
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink
                  to="/inicio-sesion"
                  className="nav-link d-flex align-items-center"
                  onClick={()=>handleLogout()}
                >
                  <i className="bi bi-box-arrow-right"> Cerrar sesión</i>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
