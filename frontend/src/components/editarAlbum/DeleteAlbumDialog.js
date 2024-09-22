import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteAlbumDialog = ({ isOpen, onClose, albumName, handleDeleteAlbum }) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>¿Estás seguro?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Esta acción eliminará el álbum "{albumName}" y todas las imágenes asociadas. Esta acción no se puede deshacer.
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-dark' variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDeleteAlbum}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteAlbumDialog;
