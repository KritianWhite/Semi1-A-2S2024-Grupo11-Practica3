import React, { useState } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import { TrashFill } from 'react-bootstrap-icons';

const EliminarCuenta = ({ handleEliminarCuenta }) => {
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => {
        setShow(false);
        setPassword('');
        setError('');
    };

    const handleShow = () => setShow(true);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmDelete = () => {
        if (password.length < 3) {
            setError('Por favor ingrese su contraseña para continuar.');
            return;
        }
        
        // Lógica para eliminar la cuenta
        handleEliminarCuenta(password);
        // Cerrar el modal después de la acción
        handleClose();
    };

    return (
        <Card>
            <Card.Header>
                <Card.Title>Eliminar Cuenta</Card.Title>
            </Card.Header>
            <Card.Body>
                <Button variant="danger" onClick={handleShow}>
                    <TrashFill className="me-2" /> Eliminar mi cuenta
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>¿Estás seguro?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos asociados.</p>
                        <Form.Group controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {error && <p className="text-danger mt-2">{error}</p>}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
};

export default EliminarCuenta;
