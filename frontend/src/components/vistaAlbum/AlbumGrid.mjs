import React from "react";
import { Card } from "react-bootstrap";
import NotImage from "../../assets/notImage.png";
import { GetGalleryApi } from "./../../Api/AlbumApi.js";
import Alertas2 from "./../Alertas2.js";

const AlbumGrid = ({ Albums = [], setGallery }) => {
  // Verificación robusta para asegurar que images es un array
  if (!Array.isArray(Albums)) {
    return <p>No hay imágenes disponibles.</p>;
  }

  const seeGallery = (id_album) => {
    GetGalleryApi(id_album)
      .then((response) => {
        setGallery(response);
      })
      .catch((error) => {
        console.error(error);
        Alertas2.showError("Error al obtener las imágenes del album");
      });
  };

  return (
    <div className="grid-container">
      {Albums.map((album) => (
        <Card
          key={album?.album_id}
          onClick={() => seeGallery(album.album_id)}
          style={{ cursor: "pointer" }}
        >
          <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
            <Card.Img
              variant="top"
              src={album.url ? album.url : NotImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <Card.Body>
            <Card.Title>
              {album?.album_nombre || "Imagen sin nombre"}
            </Card.Title>
            <Card.Text className="text-secondary">
              {album?.cantidad_imagenes + " Imágenes"}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
  
};

export default AlbumGrid;
