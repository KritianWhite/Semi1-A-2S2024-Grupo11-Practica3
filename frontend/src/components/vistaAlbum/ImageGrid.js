import React from "react";
import Alertas2 from "../Alertas2";
import "../../assets/galleryStyle.css";
import NotImage from "../../assets/notImage.png";

const ImageGrid = ({ gallery, isSubmitting, setSelectedImage, onCloseGallery }) => {

  if (!Array.isArray(gallery) || gallery.length === 0) {
    Alertas2.showError("No hay imágenes disponibles.");
    return;
  }

  return (
    <div className="FullScreen open">
      <div className="modal-content_x">
        <button
          className="close-button"
          onClick={() => {
            setTimeout(onCloseGallery, 100);
          }}
        >
          <i className="bi bi-x-circle-fill"></i>
        </button>
        <div className={`${gallery.length > 3 ? "grid-gallery": "grid-gallery_x"}`}>
          {gallery.map((image) => (
            <div
              key={image.id}
              className="grid-gallery__item"
              onClick={() => {
                setSelectedImage(image);
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                className="grid-gallery__image"
                src={image.url_s3 ? image.url_s3 : NotImage}
                alt={image.name}
              />
            </div>
          ))}
        </div>
      </div>
    
      {isSubmitting && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.75)",
            zIndex: 1250,
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ImageGrid;
