import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditAlbumDialog = ({ isOpen, onClose, newAlbumName, setNewAlbumName, handleEditAlbum }) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Álbum</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="edit-album-name">
                    <Form.Label>Nombre del álbum</Form.Label>
                    <Form.Control
                        type="text"
                        value={newAlbumName}
                        onChange={(e) => setNewAlbumName(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button  variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button className='btn btn-dark' variant="primary" onClick={handleEditAlbum}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditAlbumDialog;
