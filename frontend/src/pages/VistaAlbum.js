import React, { useState, useEffect } from "react";
import { GetAlbumGridApi, GetTagsApi } from "../Api/AlbumApi.js";
import AlbumGrid from "../components/vistaAlbum/AlbumGrid";
import ImageGrid from "../components/vistaAlbum/ImageGrid";
import ImageDialog from "../components/vistaAlbum/ImageDialog";

const VistaAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [gallery, setGallery] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openImageModal = (image) => {
    setIsSubmitting(true);
    GetTagsApi(image.id, image.descripcion)
      .then((response) => {
        setSelectedImage({ ...image, tags: response });
        setIsSubmitting(false);
        console.log(selectedImage);
      })
      .catch((error) => {
        setIsSubmitting(false);
        setSelectedImage(null);
        console.error(error);
      });
  };

  useEffect(() => {
    GetAlbumGridApi()
      .then((response) => {
        setAlbums(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return !gallery ? (
    <div className="container mx-auto min-h-screen">
      <AlbumGrid Albums={albums} setGallery={setGallery} />
    </div>
  ) : !selectedImage ? (
    <ImageGrid
      gallery={gallery}
      setSelectedImage={openImageModal}
      isSubmitting={isSubmitting}
      onCloseGallery={() => setGallery(null)}
    />
  ) : (
    <ImageDialog
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
      onCloseImage={() => setSelectedImage(null)}
    />
  );
};

export default VistaAlbum;
