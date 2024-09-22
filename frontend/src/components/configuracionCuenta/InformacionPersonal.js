import React, { useState } from 'react';
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { PencilFill, PersonFill, XCircleFill } from 'react-bootstrap-icons';

const InformacionPersonal = ({ usuario, handleInputChange, handleGuardarCambios }) => {
    const [isEditing, setIsEditing] = useState(false); // Estado para manejar el modo de edición

    const handleEditarClick = () => {
        setIsEditing(true);
    };

    const handleCancelarClick = () => {
        setIsEditing(false);
    };

    return (
        <Card className="mb-6">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>Información Personal</Card.Title>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Editar Información</Tooltip>}
                >
                    <Button variant="outline-secondary" onClick={handleEditarClick} disabled={isEditing}>
                        <PencilFill />
                    </Button>
                </OverlayTrigger>
            </Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={usuario.username}
                        onChange={handleInputChange}
                        disabled={!isEditing} // Se habilita solo en modo edición
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={usuario.email}
                        onChange={handleInputChange}
                        disabled={!isEditing} // Se habilita solo en modo edición
                    />
                </div>
                {isEditing ? (
                    <div className="d-flex justify-content-between">
                        <Button onClick={handleGuardarCambios} variant="dark">
                            <PersonFill className="me-2" /> Guardar Cambios
                        </Button>
                        <Button onClick={handleCancelarClick} variant="outline-dark">
                            <XCircleFill className="me-2" /> Cancelar
                        </Button>
                    </div>
                ) : (
                    <Button onClick={handleGuardarCambios} variant="dark" disabled>
                        <PersonFill className="me-2" /> Guardar Cambios
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default InformacionPersonal;
