import React, { useEffect, useState } from "react";

import AlbumCard from "../components/editarAlbum/AlbumCard";
import AddAlbumDialog from "../components/editarAlbum/AddAlbumDialog";
import EditAlbumDialog from "../components/editarAlbum/EditAlbumDialog";
import DeleteAlbumDialog from "../components/editarAlbum/DeleteAlbumDialog";
import Alertas2 from "../components/Alertas2";
import { getLocalStorage } from "../session";
import {
  AlbumAddApi,
  AlbumGetApi,
  AlbumUpdateApi,
  AlbumDeleteApi,
} from "../Api/AlbumApi";

// Datos de ejemplo (en una aplicación real, esto vendría de una API o base de datos)
/*const initialAlbums = [
  { id: 1, name: "Vacaciones 2023", imageCount: 15 },
  { id: 2, name: "Cumpleaños", imageCount: 8 },
  { id: 3, name: "Mascotas", imageCount: 20 },
];*/

const AlbumEdit = () => {
  const [albums, setAlbums] = useState([]);
  useEffect(() => {
    AlbumGetApi().then((response) => {
      setAlbums(response.albums);
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const data_user = getLocalStorage("data_user");

  const handleAddAlbum = () => {
    AlbumAddApi(data_user.id, newAlbumName)
      .then((response) => {
        Alertas2.showSuccess("Álbum agregado correctamente");
        setAlbums(response);
        setNewAlbumName("");
        setIsAddDialogOpen(false);
      })
      .catch((error) => {
        Alertas2.showError("Error al agregar el álbum: " + error.message);
        console.error(error);
      });
  };

  const handleEditAlbum = () => {
    if (selectedAlbum && newAlbumName.trim() !== "") {
      AlbumUpdateApi(selectedAlbum.id, newAlbumName, data_user.id)
        .then((response) => {
          Alertas2.showSuccess("Álbum editado correctamente");
          setAlbums(response);

          setNewAlbumName("");
          setIsEditDialogOpen(false);
        })
        .catch((error) => {
          Alertas2.showError("Error al editar el álbum: " + error.message);
          console.error(error);
        });
    }
  };

  const handleDeleteAlbum = () => {
    if (selectedAlbum) {
      AlbumDeleteApi(selectedAlbum.id, data_user.id)
        .then((response) => {
          Alertas2.showSuccess("Álbum eliminado correctamente");
          setAlbums(response);
          setIsDeleteDialogOpen(false);
        })
        .catch((error) => {
          Alertas2.showError("Error al eliminar el álbum: " + error.message);
          console.error(error);
        });
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="d-flex justify-content-between align-items-center my-4">
          <h1 className="fs-2 fw-bol">Editar Álbumes</h1>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="btn btn-dark"
          >
            Agregar Álbum
          </button>
        </div>
        <div className="row gx-4 gy-4">
          {albums.map((album) => (
            <div key={album.id} className="col-12 col-md-6 col-lg-4">
              <AlbumCard
                album={album}
                onEdit={() => {
                  setSelectedAlbum(album);
                  setNewAlbumName(album.name);
                  setIsEditDialogOpen(true);
                }}
                onDelete={() => {
                  setSelectedAlbum(album);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </div>
          ))}
        </div>

        <AddAlbumDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          newAlbumName={newAlbumName}
          setNewAlbumName={setNewAlbumName}
          handleAddAlbum={handleAddAlbum}
        />

        <EditAlbumDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          newAlbumName={newAlbumName}
          setNewAlbumName={setNewAlbumName}
          handleEditAlbum={handleEditAlbum}
        />

        <DeleteAlbumDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          albumName={selectedAlbum?.name}
          handleDeleteAlbum={handleDeleteAlbum}
        />
      </div>
    </>
  );
};

export default AlbumEdit;
