import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  OverlayTrigger,
  Tooltip,
  Form,
  Modal,
} from "react-bootstrap";
import { PencilFill, PersonFill, XCircleFill } from "react-bootstrap-icons";
import { ProfileImageApi, updateUserInfoApi } from "../../Api/AlbumApi"; // Método de API para actualizar
import Alertas2 from "../Alertas2";

const InformacionPersonal = ({ usuario, handleInputChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputFile, setInputFile] = useState(null);
  const [perfil, setPerfil] = useState(
    "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
  );

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [password, setPassword] = useState("");

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
    //Valiadar que el correo sea válido
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(usuario.email)) {
      Alertas2.showError("Correo electrónico inválido");
      return;
    }
    if (password.length < 3) {
      Alertas2.showError("Ingrese su contraseña");
      return;
    }

    const formData = new FormData();
    formData.append("id", usuario.id);
    formData.append("username", usuario.username);
    formData.append("email", usuario.email);

    formData.append("password", password);

    if (inputFile) {
      formData.append("file", inputFile);
    }

    try {
      const response = await updateUserInfoApi(formData);
      if (response) {
        Alertas2.showSuccess(response.message);
        if (response.url_foto) {
          setPerfil(response.url_foto);
          usuario.url_foto = response.url_foto;
        }
        setIsEditing(false);
        handleClose();
      } else {
        Alertas2.showError("No se pudo actualizar la información: " + response.message);
      }
      setPassword("");
    } catch (error) {
      Alertas2.showError("Error al guardar los cambios: " + error.message);
      setPassword("");
      //console.error("Error al guardar los cambios:", error);
    }
  };

  return (
    <>
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
              <Button onClick={handleShow} variant="dark">
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

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ingresar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
            type="password"
            className="form-control"
            placeholder="Ingrese su contraseña"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => handleSubmit()}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InformacionPersonal;
