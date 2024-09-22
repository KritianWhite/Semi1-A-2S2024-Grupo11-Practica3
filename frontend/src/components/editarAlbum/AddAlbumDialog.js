import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddAlbumDialog = ({ isOpen, onClose, newAlbumName, setNewAlbumName, handleAddAlbum }) => {
    
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Álbum</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="new-album-name">
                    <Form.Label>Nombre del álbum</Form.Label>
                    <Form.Control
                        type="text"
                        value={newAlbumName}
                        onChange={(e) => setNewAlbumName(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button className='btn btn-dark' variant="primary" onClick={handleAddAlbum}>
                    Agregar Álbum
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddAlbumDialog;
