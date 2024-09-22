import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import ImageGrid from './ImageGrid';

const TabsComponent = ({ profileImages = [], albums = [], openImageModal }) => {
    return (
        <Tabs defaultActiveKey="profile" id="album-tabs" className="mb-3">
            {/* Pestaña de Imágenes de Perfil */}
            <Tab eventKey="profile" title="Imágenes de Perfil">
                <h2 className="text-2xl font-bold mb-4">Imágenes de Perfil</h2>
                {Array.isArray(profileImages) && profileImages.length > 0 ? (
                    <ImageGrid images={profileImages} openImageModal={openImageModal} />
                ) : (
                    <p>No hay imágenes de perfil disponibles.</p>
                )}
            </Tab>

            {/* Pestaña de Álbumes */}
            <Tab eventKey="albums" title="Álbumes">
                <h2 className="text-2xl font-bold mb-4">Álbumes</h2>
                {Array.isArray(albums) && albums.length > 0 ? (
                    albums.map((album) => (
                        <div key={album?.id} className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">{album?.name || 'Álbum sin nombre'}</h3>
                            {Array.isArray(album?.images) && album.images.length > 0 ? (
                                <ImageGrid images={album.images} openImageModal={openImageModal} />
                            ) : (
                                <p>No hay imágenes disponibles en este álbum.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No hay álbumes disponibles.</p>
                )}
            </Tab>
        </Tabs>
    );
};

export default TabsComponent;
