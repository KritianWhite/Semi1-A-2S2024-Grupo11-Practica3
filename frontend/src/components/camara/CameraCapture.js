import React, { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';

const CameraCapture = ({setImageParent, buttonText}) => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Función para abrir la cámara
  const openCamera = () => {
    setShowCamera(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
      });
  };
  
  // Función para capturar la imagen
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    // Dibujar la imagen del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Obtener la imagen en base64
    const base64Image = canvas.toDataURL('image/png');
    setImageParent(base64Image);

    // Detener la cámara
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());

    setShowCamera(false);
  };

  return (
    <div className="text-center">
      <Button variant="dark" onClick={openCamera}>{buttonText}</Button>

      <Modal show={showCamera} onHide={() => setShowCamera(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{buttonText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="camera-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <video ref={videoRef} style={{ width: '100%', maxHeight: '300px' }}></video>
            <Button
              variant="outline-light"
              onClick={captureImage}
              style={{
                position: 'absolute',
                bottom: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'white',
                border: '2px solid #007bff'
              }}
            />
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CameraCapture;
