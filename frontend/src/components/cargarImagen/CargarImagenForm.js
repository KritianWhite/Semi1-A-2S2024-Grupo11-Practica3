import React from 'react';
import { Card, Button, Form } from 'react-bootstrap'; // Corrige la importación de Card.Body
import { UploadCloud } from 'lucide-react';

const CargarImagenForm = ({
    imageName,
    setImageName,
    imageDescription,
    setImageDescription,
    selectedAlbum,
    setSelectedAlbum,
    albums,
    handleFileSelect,
    previewUrl,
    handleSubmit,
    fileInputRef
}) => {
    return (
       <div>
         <Card>
            <Card.Header>
                <Card.Title>Formulario de carga de imágenes</Card.Title>
            </Card.Header>
            <Card.Body> {/* Usamos Card.Body en lugar de CardContent */}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="image-name" className="mb-3">
                        <Form.Label>Nombre de la imagen</Form.Label>
                        <Form.Control
                            type="text"
                            value={imageName}
                            onChange={(e) => setImageName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="image-description" className="mb-3">
                        <Form.Label>Descripción de la imagen</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={imageDescription}
                            onChange={(e) => setImageDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="album-select" className="mb-3">
                        <Form.Label>Álbum</Form.Label>
                        <Form.Select value={selectedAlbum} onChange={(e) => setSelectedAlbum(e.target.value)} required>
                            <option value="">Selecciona un álbum</option>
                            {albums.map((album) => (
                                <option key={album.id} value={album.id}>
                                    {album.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="image-file" className="mb-3">
                        <Form.Label>Seleccionar imagen</Form.Label>
                        <Form.Control 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef}
                            onChange={handleFileSelect} 
                            required 
                        />
                    </Form.Group>

                    {previewUrl && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Vista previa:</h3>
                            <img src={previewUrl} alt="Vista previa" 
                            className="img-fluid rounded-lg mx-auto d-block"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '300px'
                            }} />
                        </div>
                    )}
                </Form>
            </Card.Body> {/* Cambiado CardContent por Card.Body */}
            <Card.Footer>
                <Button onClick={handleSubmit} className="w-100" variant="dark">
                    <UploadCloud className="me-2" /> Subir Imagen
                </Button>
            </Card.Footer>
        </Card>
       </div>
    );
};

export default CargarImagenForm;
