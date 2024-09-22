import React, { useState } from 'react';

import CargarImagenForm from '../components/cargarImagen/CargarImagenForm';

const albums = [
    { id: 1, name: 'Vacaciones 2023' },
    { id: 2, name: 'Cumpleaños' },
    { id: 3, name: 'Mascotas' },
];

const CargarImagen = () => {
    const [imageName, setImageName] = useState('');
    const [imageDescription, setImageDescription] = useState('');
    const [selectedAlbum, setSelectedAlbum] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí iría la lógica para subir la imagen al servidor
        console.log('Subiendo imagen:', {
            name: imageName,
            description: imageDescription,
            album: selectedAlbum,
            file: selectedFile
        });
        // Resetear el formulario después de la subida
        setImageName('');
        setImageDescription('');
        setSelectedAlbum('');
        setSelectedFile(null);
        setPreviewUrl('');
    };

    return (
        <div className="container mx-auto p-4">
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
            />
        </div>
    );
};

export default CargarImagen;
