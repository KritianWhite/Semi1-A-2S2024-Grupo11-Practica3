import React from "react";
import { Lock } from "react-bootstrap-icons";
import { Form, InputGroup } from "react-bootstrap";

const CredencialesForm = ({ credentials, onCredentialsChange, onSubmit }) => {
  return (
    <Form onSubmit={onSubmit} className="mb-3">
      <Form.Group className="mb-3" controlId="forEmail">
        <Form.Label htmlFor="username" className="form-label">
          Usuario o Correo Electrónico
        </Form.Label>
        <InputGroup hasValidation>
          <InputGroup.Text id="inputGroupPrepend">
            <i className="bi bi-envelope"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            className="form-control"
            placeholder="Ingrese su usuario o correo electrónico"
            id="username"
            name="username"
            value={credentials.username}
            onChange={onCredentialsChange}
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
            placeholder="Ingrese su contraseña"
            id="password"
            name="password"
            value={credentials.password}
            onChange={onCredentialsChange}
            required
          />
        </InputGroup>
      </Form.Group>

      <button type="submit" className="btn btn-dark w-100">
        <Lock className="me-2" /> Iniciar Sesión
      </button>
      <a href="/registro-usuario" className="d-block mt-2 text-left">
        Registrarse...
      </a>
    </Form>
  );
};

export default CredencialesForm;
