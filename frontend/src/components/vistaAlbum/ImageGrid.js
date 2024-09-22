import React from 'react';
import { Card } from 'react-bootstrap';

const ImageGrid = ({ images = [], openImageModal }) => {
    // Verificación robusta para asegurar que images es un array
    if (!Array.isArray(images) || images.length === 0) {
        return <p>No hay imágenes disponibles.</p>;
    }

    return (
        <div className="d-flex flex-wrap">
            {images.map((image) => (
                <Card
                    key={image?.id}
                    className="m-2"
                    style={{ width: '18rem' }}
                    onClick={() => openImageModal(image)}
                >
                    <Card.Img variant="top" src={image?.src} />
                    <Card.Body>
                        <Card.Title>{image?.name || 'Imagen sin nombre'}</Card.Title>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default ImageGrid;
