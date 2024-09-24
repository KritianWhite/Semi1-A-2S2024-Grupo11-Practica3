import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { ProfileImageApi } from "../../Api/AlbumApi";

const PerfilUsuario = ({ usuario }) => {
  const [perfil, setPerfil] = useState(
    "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
  );
  useEffect(() => {
    ProfileImageApi()
      .then((response) => {
        setPerfil(response.url_foto);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [setPerfil, perfil]);

  return (
    <>
      <div className="d-flex flex-column align-items-center mb-4">
        <div className="mb-3">
          <img
            src={perfil}
            alt={usuario.username}
            className="rounded-circle"
            style={{ width: "150px", height: "150px" }}
          />
        </div>
        <div>
          <Card className="w-100">
            <Card.Header>Información del Usuario</Card.Header>
            <Card.Body>
              <h3>Usuario: {usuario.username}</h3>
              <p className="text-muted">Correo: {usuario.email}</p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PerfilUsuario;
