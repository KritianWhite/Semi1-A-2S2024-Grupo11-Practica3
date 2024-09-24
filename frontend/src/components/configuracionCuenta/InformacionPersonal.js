import React, { useEffect, useState } from "react";
import { Button, Card, OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { PencilFill, PersonFill, XCircleFill } from "react-bootstrap-icons";
import { ProfileImageApi, updateUserInfoApi } from "../../Api/AlbumApi"; // Método de API para actualizar
import Alertas2 from "../Alertas2";

const InformacionPersonal = ({ usuario, handleInputChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputFile, setInputFile] = useState(null);
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

  const handleEditarClick = () => {
    setIsEditing(true);
  };

  const handleCancelarClick = () => {
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    // Crear un formData para enviar la imagen y los datos del usuario
    const formData = new FormData();
    formData.append("id", usuario.id);
    formData.append("username", usuario.username);
    formData.append("email", usuario.email);

    if (inputFile) {
      formData.append("file", inputFile);
    }

    try {
      const response = await updateUserInfoApi(formData);
      if (response) {
        Alertas2.showSuccess(response.message);
        usuario.url_foto = response.url_foto;
        setPerfil(response.url_foto);
        setIsEditing(false);
      } else {
        Alertas2.showError("No se pudo actualizar la información");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  return (
    <Card className="mb-6">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title>
          <Card.Img
            src={perfil}
            className="rounded-circle me-3 mt-2"
            style={{ width: "80px", height: "80px" }}
          />
          Información Personal
        </Card.Title>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Editar Información</Tooltip>}
        >
          <Button
            variant="outline-secondary"
            onClick={handleEditarClick}
            disabled={isEditing}
          >
            <PencilFill />
          </Button>
        </OverlayTrigger>
      </Card.Header>
      <Card.Body>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={usuario.username}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </Form.Group>

        {isEditing && (
          <Form.Group controlId="image-file" className="mb-3">
            <Form.Label>Seleccionar imagen</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setInputFile(e.target.files[0])}
              disabled={!isEditing}
            />
          </Form.Group>
        )}

        {isEditing ? (
          <div className="d-flex justify-content-between">
            <Button onClick={handleSubmit} variant="dark">
              <PersonFill className="me-2" /> Guardar Cambios
            </Button>
            <Button onClick={handleCancelarClick} variant="outline-dark">
              <XCircleFill className="me-2" /> Cancelar
            </Button>
          </div>
        ) : (
          <Button onClick={handleSubmit} variant="dark" disabled>
            <PersonFill className="me-2" /> Guardar Cambios
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default InformacionPersonal;
