import React from 'react';
import { Card } from 'react-bootstrap';
import { PencilFill, TrashFill } from 'react-bootstrap-icons';

const AlbumCard = ({ album, onEdit, onDelete }) => {
    return (
        <Card>
            <Card.Header>
                <Card.Title>{album.name}</Card.Title>
            </Card.Header>
            <Card.Body>
                <p>{album.imageCount} imágenes</p>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-end gap-2">
                <button className='btn btn-dark' onClick={onEdit}>
                    <PencilFill /> Editar
                </button>
                <button className="btn btn-danger" onClick={onDelete}>
                    <TrashFill /> Eliminar
                </button>
            </Card.Footer>
        </Card>
    );
};

export default AlbumCard;
