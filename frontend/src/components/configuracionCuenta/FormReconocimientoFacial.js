import React, { useState } from 'react';
import { Container, Row, Col, Form, Image } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Alertas from '../Alertas';
import api_uri from '../../config';
import CameraCapture from '../camara/CameraCapture';

const FormReconocimientoFacial = ({ usuario, handleClose, handleImageChangeParent }) => {
    const [image, setImage] = useState(undefined);

    const convertImageBase64 = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage(reader.result);
            };
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para enviar la imagen al backend
        if (usuario && image) {
            axiosRegistrarRostro();
        } else {
            console.error('faltan campos por rellenar' + usuario);
            Alertas.showAlert('Faltan campos por rellenar', 'error');
        }
    }

    const axiosRegistrarRostro = async () => {
        // Lógica para enviar la imagen al backend
        const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
        const data = {
            id: usuario.id,
            username: usuario.username,
            faceImage: base64Image
        };

        axios.post(`${api_uri}/user/register_face`, data)
            .then(res => {
                if (res.data.status === 200) {
                    Alertas.showAlert('Rostro registrado correctamente', 'success');
                    handleImageChangeParent();
                }
            })
            .catch(err => {
                console.error(err);
                Alertas.showAlert('Error al registrar el rostro', 'error');
            });
    }

    return (
        <Container>


            <Tabs
                defaultActiveKey="archivo"
                id="justify-tab-example"
                className="mb-3"
                justify
                variant='tabs'
            >
                <Tab eventKey="archivo"
                    title="Archivo"
                >
                    <Row className='p-5'>
                        <Col>
                            <div className="justify-content-center mt-3">
                                <Form.Group controlId="custom-file">
                                    <Form.Label>Seleccionar imagen</Form.Label>
                                    <Form.Control
                                        type="file"
                                        label="Seleccionar imagen"
                                        custom
                                        accept="image/*"
                                        onChange={(e) => {
                                            convertImageBase64(e);
                                        }}
                                    />
                                </Form.Group>
                            </div>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="camara" title="Camara">
                    <Row>
                        <CameraCapture setImageParent={setImage} buttonText={"Tomar Foto"} />
                    </Row>
                </Tab>
            </Tabs>
            {image && (
                <Row className="justify-content-center">
                    <Col className="d-flex justify-content-center">
                        <h4>Imagen seleccionada</h4>
                    </Col>
                </Row>
            )}
            {image && (
                <Row className="justify-content-center">
                    <Col className="d-flex justify-content-center mt-3">
                        <Image
                            src={image ? image : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'}
                            alt={usuario.username}
                            style={{
                                width: '35%',
                                aspectRatio: '1.30/1',
                            }}
                            className=''
                            thumbnail
                        />
                    </Col>
                </Row>
            )}

            <Row className="justify-content-center mt-3 p-5">
                <Col className="d-flex justify-content-center">
                    <Button variant="outline-danger"
                        onClick={handleClose}
                        style={{
                            width: '100%'
                        }}
                    >
                        Cancelar
                    </Button>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Button variant="outline-success"
                        style={{
                            width: '100%'
                        }}
                        onClick={handleSubmit}
                    >
                        Guardar
                    </Button>
                </Col>

            </Row>

        </Container>
    );
};

export default FormReconocimientoFacial;
