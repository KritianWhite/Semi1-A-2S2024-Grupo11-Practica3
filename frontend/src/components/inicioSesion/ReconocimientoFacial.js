import React, { useState } from 'react';
import CameraCapture from '../camara/CameraCapture';
import axios from 'axios';
import api_uri from '../../config';
import Alertas from '../Alertas';
import { setLocalStorage } from '../../session';
import { useNavigate } from 'react-router-dom';

const ReconocimientoFacial = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const onInputChange = (e) => {
        setUsername(e.target.value);
    }

    const onPictureTaken = (image) => {
        if (image) {
            axiosIniciarSesion(image);
        }
    }

    const axiosIniciarSesion = async (imagen) => {
        // Lógica para enviar la imagen al backend
        const base64Image = imagen.replace(/^data:image\/\w+;base64,/, "");
        const data = {
            username: username,
            faceImage: base64Image
        };

        axios.post(`${api_uri}/user/compare_faces`, data)
            .then(res => {
                if (res.status === 200) {
                    console.log('Usuario autenticado:', res.data);
                    setIsAuthenticated(true);
                    setLocalStorage('data_user', res.data.data_user);
                    //redirigimos al usuario a la página de inicio
                    Alertas.showAlert('Inicio de sesión exitoso', 'success');
                    navigate('/pagina-inicio');
                }
            })
            .catch(err => {
                console.error(err);
                if (err.response && err.response.data) {
                    Alertas.showAlert(err.response.data.message, 'error');
                } else {
                    Alertas.showAlert('Error al iniciar sesión', 'error');
                }
            });
    }
    return (
        <form className="mb-3">
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Usuario o Correo Electrónico</label>
                <input
                    type="text"
                    className="form-control"
                    id="username2"
                    name="username"
                    value={username}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="mb-1">
                <label htmlFor="username" className="form-label">Rostro:</label>

            </div>
            
            <CameraCapture setImageParent={onPictureTaken} buttonText={"Activar Camara"} />

            <a href="/registro-usuario" className="d-block mt-2 text-left">Registrarse...</a>
        </form>
    );
};

export default ReconocimientoFacial;
