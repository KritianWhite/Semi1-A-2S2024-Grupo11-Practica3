import React, { useState } from 'react';

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

    const handleExtractText = async () => {
        if (!selectedFile) {
            setError('Por favor, selecciona una imagen primero.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simular la extracción de texto con un retraso
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Simulación de texto extraído de la imagen
            setExtractedText(
                'Este es un ejemplo de texto extraído de la imagen. En una implementación real, este texto sería el resultado de procesar la imagen con un servicio de OCR como Amazon Textract.'
            );
        } catch (err) {
            setError('Hubo un error al extraer el texto de la imagen. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Extracción de Texto de Imágenes</h1>
            <ExtraccionTextoForm
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
