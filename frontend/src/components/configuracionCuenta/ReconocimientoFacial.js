import React from "react";
import {
  Card,
  FormCheck,
  Container,
  Row,
  Image,
  Button,
} from "react-bootstrap";
import { CameraFill } from "react-bootstrap-icons";

const ReconocimientoFacial = ({
  usuario,
  handleReconocimientoFacialChange,
  face_id_data,
  handleOpenModal,
}) => {
  return (
    <Card className="mb-6">
      <Card.Header>
        <Card.Title>Reconocimiento Facial</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <FormCheck
            type="switch"
            id="reconocimientoFacial"
            checked={usuario.face_id_habilitado}
            onChange={handleReconocimientoFacialChange} // Cambiado de onClick a onChange
            label={
              usuario.face_id_habilitado
                ? "Reconocimiento facial activado"
                : "Reconocimiento Facial Desactivado"
            }
          
          />
        </div>
        {usuario.face_id_habilitado === true && (
          <Container>
            <Row className="justify-content-center">
              <Image
                src={
                  face_id_data && face_id_data.url_foto_s3
                    ? face_id_data.url_foto_s3
                    : "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                }
                alt={usuario.username}
                style={{ width: "150px", height: "150px" }}
                thumbnail
              />
            </Row>
            <Row className="justify-content-center">
              <Button
                variant="outline-dark"
                className="w-100 mt-3"
                onClick={handleOpenModal}
              >
                <CameraFill className="me-2" />
                Configurar rostro
              </Button>
            </Row>
          </Container>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReconocimientoFacial;
