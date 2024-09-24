import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api_uri from '../config';
import { setLocalStorage, getLocalStorage } from '../session';

import CredencialesForm from '../components/inicioSesion/CredencialesForm';
import ReconocimientoFacial from '../components/inicioSesion/ReconocimientoFacial';

const InicioSesion = ({ setIsAuthenticated }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const data_user = getLocalStorage('data_user');
        if(data_user) {
            navigate('/pagina-inicio');
        }
    });

    const handleCredentialsChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleCredentialsSubmit = (e) => {
        e.preventDefault();
        setError('');
        const data = {
            identifier: credentials.username,
            password: credentials.password
        }
        //hacemos la peticion al backend
        axios.post(api_uri+ '/user/login_credentials', data)
            .then(res => {
                if (res.status === 200) {
                    setIsAuthenticated(true);
                    setLocalStorage('data_user', res.data.data_user);
                    //redirigimos al usuario a la página de inicio
                    navigate('/pagina-inicio');
                }
            })
            .catch(err => {
                console.error(err);
                if(err.response && err.response.data) {
                    setError(err.response.data.message);
                }
            });
        //setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
    };


    return (
        <>
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="text-center mb-4">Inicio de Sesión</h1>
                {error && <div className="alert alert-danger">{error}</div>}

                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="credentials-tab" data-bs-toggle="tab" data-bs-target="#credentials" type="button" role="tab">Credenciales</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="facial-tab" data-bs-toggle="tab" data-bs-target="#facial" type="button" role="tab">Reconocimiento Facial</button>
                    </li>
                </ul>

                <div className="tab-content mt-3" id="myTabContent">
                    <div className="tab-pane fade show active" id="credentials" role="tabpanel">
                        <CredencialesForm
                            credentials={credentials}
                            onCredentialsChange={handleCredentialsChange}
                            onSubmit={handleCredentialsSubmit}
                        />
                    </div>
                    <div className="tab-pane fade" id="facial" role="tabpanel">
                        <ReconocimientoFacial setIsAuthenticated={setIsAuthenticated}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InicioSesion;
