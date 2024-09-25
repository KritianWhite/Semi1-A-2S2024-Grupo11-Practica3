import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { AlertCircle, FileText } from 'lucide-react';

const ExtracionTextoForm = ({
  selectedFile,
  previewUrl,
  extractedText,
  isLoading,
  error,
  handleFileSelect,
  handleExtractText,
}) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Sube una imagen para extraer su texto</Card.Title>
      </Card.Header>
      <Card.Body className="space-y-4">
        <Form.Group controlId="image-file" className="mb-3">
          <Form.Label>Seleccionar imagen</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Form.Group>

        {previewUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Vista previa:</h3>
            <div className="d-flex justify-content-center">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="img-fluid rounded-lg"
                style={{ maxHeight: '256px' }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <AlertCircle className="me-2 h-4 w-4" />
            <div>
              <strong>Error: </strong> {error}
            </div>
          </div>
        )}

        {extractedText && (
          <Form.Group controlId="extracted-text" className="mb-3">
            <Form.Label>Texto extraído:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={extractedText}
              readOnly
            />
          </Form.Group>
        )}
      </Card.Body>
      <Card.Footer>
        <Button
          onClick={handleExtractText}
          disabled={!selectedFile || isLoading}
          className="w-100"
          variant="dark"
        >
          {isLoading ? (
            <>Procesando...</>
          ) : (
            <>
              <FileText className="me-2 h-4 w-4" /> Extraer Texto
            </>
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ExtracionTextoForm;
