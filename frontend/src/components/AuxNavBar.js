import React from 'react';
import { useLocation } from 'react-router-dom';

const AuxNavBar = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/inicio-sesion", "/registro-usuario"];
  const estilos = hideNavbarPaths.includes(location.pathname);

  const containerStyle = estilos 
    ? { backgroundColor: "#f0f1f7" } 
    : { paddingTop: "56px", backgroundColor: "#f0f1f7"  };

  return (
    <div
      className="container-fluid"
    >
      <div className="row min-vh-100" style={containerStyle}>
        <div className="col d-flex justify-content-center align-items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuxNavBar;
