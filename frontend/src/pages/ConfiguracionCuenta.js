import React, { useState, useEffect } from 'react';
import InformacionPersonal from '../components/configuracionCuenta/InformacionPersonal';
import ReconocimientoFacial from '../components/configuracionCuenta/ReconocimientoFacial';
import EliminarCuenta from '../components/configuracionCuenta/EliminarCuenta';
import { getLocalStorage } from '../session';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api_uri from '../config';
import Alertas from '../components/Alertas';
import Modal from 'react-bootstrap/Modal';
import FormReconocimientoFacial from '../components/configuracionCuenta/FormReconocimientoFacial';

const ConfiguracionCuenta = () => {
    const [usuario, setUsuario] = useState({});
    const [face_id_data, setFaceIdData] = useState(undefined); // Información del reconocimiento facial prinicipalmente la foto
    const [showModalFaceRecognition, setShowModalFaceRecognition] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Lógica para cargar la información del usuario
        const data_user = getLocalStorage('data_user');
        if (!data_user) {
            navigate('/inicio-sesion');
        }
        setUsuario(data_user);
        axiosFaceIdData(data_user);
    }, [navigate]);

    const axiosFaceIdData = async (data_user) => {
        // Lógica para cargar la información del reconocimiento facial
        axios.get(`${api_uri}/user/face_id_data/${data_user.id}`)
            .then(res => {
                if (res.data.status === 404) { // el usuario tiene habilitado el reconocimiento facial pero no tiene datos
                    console.log(res.data);
                    Alertas.showAlert("Debe de configurar su rostro para reconocimiento facial", "info");
                    return
                }
                setFaceIdData(res.data.face_id_data);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const axiosToggleFaceId = async (data_user) => {
        const data = {
            id: data_user.id,
        }
        axios.put(`${api_uri}/user/toggle_face_id`, data)
            .then(res => {
                if (res.data.status === 200) {
                    setUsuario(prev => ({ ...prev, face_id_habilitado: !prev.face_id_habilitado }));
                    //actualizamos el localStorage
                    data_user.face_id_habilitado = !data_user.face_id_habilitado;
                    localStorage.setItem('data_user', JSON.stringify(data_user));
                    console.log(res.data);
                    Alertas.showAlert(res.data.message, "success");
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUsuario(prev => ({ ...prev, [name]: value }));
    };

    const handleCloseModalFaceRecognition = () => {
        setShowModalFaceRecognition(false);
    }

    const handleOpenModalFaceRecognition = () => {
        setShowModalFaceRecognition(true);
    }

    const handleReconocimientoFacialChange = () => {
        if (face_id_data) { //si hay datos de reconocimiento facial entonces enviamos peticion para cambiar el estado en la base de datos
            const data_user = getLocalStorage('data_user');
            axiosToggleFaceId(data_user);
        } else {
            setShowModalFaceRecognition(true);
        }

    };

    const handleGuardarCambios = () => {
        console.log("Guardando cambios:", usuario);
        // Lógica para guardar los cambios en el backend
    };

    const handleEliminarCuenta = () => {
        console.log("Eliminando cuenta...");
        // Lógica para eliminar la cuenta en el backend
    };

    const handleReconocimientoFacialImageChange = () => {
        //cambiamos el valor de face_id_habilitado en el localStorage
        const data_user = getLocalStorage('data_user');
        data_user.face_id_habilitado = true;
        localStorage.setItem('data_user', JSON.stringify(data_user));
        //actualizamos el estado
        setUsuario(prev => ({ ...prev, face_id_habilitado: true }));
        //cargamos los datos del usuario
        axiosFaceIdData(data_user);
        //cerrar modal
        setShowModalFaceRecognition(false);
    }

    return (
        <>
            <div className="col-md-8 my-4">
                <h1 className="text-center">Configuración de la Cuenta</h1>

                <a href="/pagina-inicio" className="d-block mt-2 mb-2 text-left">Regresar</a>
                <InformacionPersonal
                    usuario={usuario}
                    handleInputChange={handleInputChange}
                    handleGuardarCambios={handleGuardarCambios}
                />

                <ReconocimientoFacial
                    usuario={usuario}
                    handleReconocimientoFacialChange={handleReconocimientoFacialChange}
                    face_id_data={face_id_data}
                    handleOpenModal={handleOpenModalFaceRecognition}
                />

                <Modal show={showModalFaceRecognition} fullscreen={true} onHide={handleCloseModalFaceRecognition}>
                    <Modal.Header closeButton>
                        <Modal.Title>Configuración de Rostro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormReconocimientoFacial
                            handleClose={handleCloseModalFaceRecognition}
                            handleImageChangeParent={handleReconocimientoFacialImageChange}
                            usuario={usuario}
                        />
                    </Modal.Body>
                </Modal>

                <EliminarCuenta handleEliminarCuenta={handleEliminarCuenta} />
            </div>
        </>
    );
};

export default ConfiguracionCuenta;
