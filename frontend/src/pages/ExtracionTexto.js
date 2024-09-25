import React, { useState } from 'react';
import api_uri from '../config';
import ExtraccionTextoForm from '../components/extraccionTexto/ExtracionTextoForm';

const ExtracionTexto = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setExtractedText('');
            setError('');
        }
    };

    const handleImageChange = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleExtractText = async () => {
        if (!selectedFile) {
            setError('Por favor, selecciona una imagen primero.');
            return;
        }

        setIsLoading(true);
        setError('');
        setExtractedText('');

        try {
            const base64Image = await handleImageChange(selectedFile);            

            const response = await fetch(`${api_uri}/image/extract-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                }),
            });        
            
            const data = await response.json();
            setExtractedText(data.text);            

        } catch (err) {
            setError('Hubo un error al extraer el texto de la imagen. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Extracción de Texto de Imágenes</h1>
            <ExtraccionTextoForm textStyle={{ whiteSpace: 'pre-wrap' }}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                extractedText={extractedText}
                isLoading={isLoading}
                error={error}
                handleFileSelect={handleFileSelect}
                handleExtractText={handleExtractText}
            />
        </div>
    );
};

export default ExtracionTexto;
