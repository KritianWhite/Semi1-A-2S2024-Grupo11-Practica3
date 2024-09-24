import React from "react";
import { Camera, XCircle } from "react-bootstrap-icons";
import { Form, Col, Row, InputGroup } from "react-bootstrap";

const FormularioRegistro = ({
  formData,
  handleChange,
  handleImageChange,
  handleSubmit,
  handleClearImage,
}) => {
  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3" controlId="forUsuario">
            <Form.Label htmlFor="username" className="form-label">
              Nombre de usuario
            </Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">
                <i className="bi bi-person"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Ingresa de usuario"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="forPassword">
            <Form.Label htmlFor="password" className="form-label">
              Contraseña
            </Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">
                <i className="bi bi-lock"></i>
              </InputGroup.Text>
              <Form.Control
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label htmlFor="email" className="form-label">
              Correo electrónico
            </Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">
                <i className="bi bi-person"></i>
              </InputGroup.Text>
              <Form.Control
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Ingresa tu correo electrónico"
                aria-describedby="inputGroupPrepend"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="forRepeatPassword">
            <Form.Label
              htmlFor="confirmPassword"
              className="form-label fw-normal"
            >
              Confirmar contraseña
            </Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">
                <i className="bi bi-lock"></i>
              </InputGroup.Text>
              <Form.Control
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirma tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                isInvalid={formData.password !== formData.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                Contraeñas no coinciden
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col xs={12}>
          <div className="mb-3">
            <label htmlFor="profileImage" className="form-label">
              Imagen de perfil
            </label>
            <Col className="text-center mb-2 mt-1">
              <div className="image-container">
                <img
                  src={
                    formData.profileImage ||
                    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                  }
                  alt="Profile"
                  style={{
                    width: "25%",
                    aspectRatio: "1/1",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </Col>
            <div className="d-flex align-items-center">
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleImageChange}
                className="form-control-file"
                style={{ display: "none" }}
                accept="image/*"
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => document.getElementById("profileImage").click()}
              >
                <Camera className="me-2" /> Subir imagen
              </button>
              {formData.profileImage && (
                <div className="d-flex align-items-center">
                  <span className="ms-3 text-muted">{formData.nameImage}</span>
                  <div
                    type="button"
                    className=" btn-outline-danger ms-2"
                    onClick={() => handleClearImage()}
                  >
                    <XCircle className="text-danger" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <button type="submit" className="btn btn-dark w-100">
            Registrarse
          </button>
          <a href="/inicio-sesion" className="d-block mt-2 text-left">
            Iniciar sesión...
          </a>
        </Col>
      </Row>
    </Form>
  );
};

export default FormularioRegistro;
