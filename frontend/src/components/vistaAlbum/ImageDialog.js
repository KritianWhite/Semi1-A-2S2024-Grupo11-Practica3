import React from 'react';
import { Modal, Badge, Form } from 'react-bootstrap';

const ImageDialog = ({ selectedImage, selectedLanguage, setSelectedLanguage, onClose }) => {
    const translateDescription = (description, targetLang) => {
        const translations = {
            'es': description,
            'en': 'Image description in English',
            'fr': 'Description de l\'image en français',
            'de': 'Bildbeschreibung auf Deutsch'
        };
        return translations[targetLang] || description;
    };

    return (
        <Modal show={!!selectedImage} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{selectedImage?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex">
                    <img
                        src={selectedImage?.src}
                        alt={selectedImage?.name}
                        className="img-fluid w-50 me-3"
                    />
                    <div className="w-50">
                        <h4>Descripción:</h4>
                        <p>{translateDescription(selectedImage?.description, selectedLanguage)}</p>
                        <h4>Idioma de la descripción:</h4>
                        <Form.Select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </Form.Select>
                        <h4 className="mt-4">Etiquetas:</h4>
                        <div>
                            {selectedImage?.tags.map((tag, index) => (
                                <Badge key={index} bg="secondary" className="me-2">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ImageDialog;
