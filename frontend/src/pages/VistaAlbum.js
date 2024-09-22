import React, { useState } from 'react';

import TabsComponent from '../components/vistaAlbum/TabsComponent';
import ImageDialog from '../components/vistaAlbum/ImageDialog';

const VistaAlbum = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('es');

    const openImageModal = (image) => {
        const simulatedTags = ['Persona', 'Paisaje', 'Naturaleza', 'Cielo', 'Montaña'];
        setSelectedImage({ ...image, tags: simulatedTags });
    };

    const profileImages = [
        { id: 1, src: 'https://img.freepik.com/foto-gratis/pintura-lago-montana-montana-al-fondo_188544-9126.jpg', name: 'Perfil 1', description: 'Descripción de la imagen de perfil 1' },
        { id: 2, src: 'https://c4.wallpaperflare.com/wallpaper/558/625/87/fox-trees-fantasy-art-dreamland-wallpaper-preview.jpg', name: 'Perfil 2', description: 'Descripción de la imagen de perfil 2' },
    ];

    const albums = [
        {
            id: 1,
            name: 'Álbum 1',
            images: [
                { id: 1, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Wallpaper-gnu.png/1200px-Wallpaper-gnu.png', name: 'Imagen 1', description: 'Descripción de la imagen 1' },
                { id: 2, src: 'https://e0.pxfuel.com/wallpapers/494/1009/desktop-wallpaper-warrior-epic-warrior.jpg', name: 'Imagen 2', description: 'Descripción de la imagen 2' },
            ],
        },
        {
            id: 2,
            name: 'Álbum 2',
            images: [
                { id: 3, src: 'https://www.azutura.com/media/catalog/product/cache/50/image/9df78eab33525d08d6e5fb8d27136e95/W/S/WS-50366_WP-01.jpg', name: 'Imagen 3', description: 'Descripción de la imagen 3' },
                { id: 4, src: 'https://m.media-amazon.com/images/I/81dPcSCU+xL._AC_UF894,1000_QL80_.jpg', name: 'Imagen 4', description: 'Descripción de la imagen 4' },
            ],
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <TabsComponent
                profileImages={profileImages || []}
                albums={albums || []}
                openImageModal={openImageModal}
            />
            {selectedImage && (
                <ImageDialog
                    selectedImage={selectedImage}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};

export default VistaAlbum;
