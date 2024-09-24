import React, { useState } from "react";
import { Modal, Badge, Form } from "react-bootstrap";
import { GetTranslateApi } from "../../Api/AlbumApi";

const ImageDialog = ({ selectedImage, setSelectedImage, onCloseImage }) => {

  const [selectedLanguage, setSelectedLanguage] = useState("es");

  const translateDescription = (targetLang, selectedImage) => {
    GetTranslateApi(selectedImage.descripcion, targetLang)
      .then((response) => {
        selectedImage.descripcion = response.text;
        setSelectedImage(selectedImage);
        setSelectedLanguage(targetLang);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Modal show={!!selectedImage} onHide={onCloseImage} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedImage?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex">
          <img
            src={selectedImage?.url_s3}
            alt={selectedImage?.descripcion}
            className="img-fluid w-50 me-3"
          />
          <div className="w-50 justify-content-center">
            <h4>Descripción:</h4>
            <p>{selectedImage?.descripcion}</p>
            <h4>Idioma de la descripción:</h4>
            <Form.Select
              value={selectedLanguage}
              onChange={(e) => translateDescription(e.target.value, selectedImage)}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </Form.Select>
            <h4 className="mt-4">Etiquetas:</h4>
            <div>
              {selectedImage?.tags.map((tag, index) => (
                <Badge
                  key={index}
                  className="me-2"
                  bg="none"
                  style={{
                    backgroundColor: tag.color,
                    color: "black",
                    fontSize: "0.85rem",
                    margin: "0.3rem",
                  }}
                >
                  {tag.tag}
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
