import React, { useState, useEffect, useRef } from "react";
import CargarImagenForm from "../components/cargarImagen/CargarImagenForm";
import Alertas2 from "../components/Alertas2";
import { AlbumGetApi, UploadImage } from "../Api/AlbumApi";

const CargarImagen = () => {
  const [albums, setAlbums] = useState([]);
  useEffect(() => {
    AlbumGetApi()
      .then((response) => {
        setAlbums(response.albums);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [imageName, setImageName] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setisSubmitting(true);
    UploadImage(selectedAlbum, imageDescription, selectedFile)
      .then((response) => {
        console.log(response);
        Alertas2.showSuccess("Imagen subida correctamente");
        setisSubmitting(false);
        setImageName("");
        setImageDescription("");
        setSelectedAlbum("");
        setSelectedFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Esto resetea el input file
        }
      })
      .catch((error) => {
        Alertas2.showError("Error al agregar el álbum: " + error.message);
        console.error(error);
        setisSubmitting(false);
        setImageName("");
        setImageDescription("");
        setSelectedAlbum("");
        setSelectedFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Esto resetea el input file
        }
      });
  };

  return (
    <div className="container mx-auto p-4" style={{ maxWidth: "800px" }}>
      <h1 className="text-2xl font-bold mb-6">Subir Imagen</h1>
      <CargarImagenForm
        imageName={imageName}
        setImageName={setImageName}
        imageDescription={imageDescription}
        setImageDescription={setImageDescription}
        selectedAlbum={selectedAlbum}
        setSelectedAlbum={setSelectedAlbum}
        albums={albums}
        handleFileSelect={handleFileSelect}
        previewUrl={previewUrl}
        handleSubmit={handleSubmit}
        fileInputRef={fileInputRef}
      />

      {isSubmitting && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.7)",
            zIndex: 1050,
            backdropFilter: "blur(5px)",
          }}
        >
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Subiendo...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargarImagen;
