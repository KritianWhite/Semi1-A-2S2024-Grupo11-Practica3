import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioRegistro from '../components/registro/FormularioRegistro';
import axios from 'axios';
import api_uri from '../config';
import Alertas from '../components/Alertas';
import Spinner from 'react-bootstrap/Spinner';
import { getLocalStorage } from '../session';

const RegistroUsuario = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileImage: undefined,
        nameImage: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const data_user = getLocalStorage('data_user');
        if(data_user) {
            navigate('/pagina-inicio');
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        //guardar la imagen en base64 en el estado
        if (file) {
            const reader = new FileReader();
            setFormData(prevState => ({
                ...prevState,
                nameImage: file.name
            }));
            reader.readAsDataURL(file);
            reader.onload = () => {

                setFormData(prevState => ({
                    ...prevState,
                    profileImage: reader.result
                }));
            };
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            Alertas.showToast('Las contraseñas no coinciden', 'error');
            return;
        }

        const fetchData = async () => {

            setLoading(true); // Inicia el spinner al comenzar la petición
            try {
                const data = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    profileImage: formData.profileImage
                };

                const headers = {
                    'Content-Type': 'application/json'
                };

                const response = await axios.post(api_uri + "/user/register", data, { headers: headers });
                Alertas.showAlert(response.data.message, 'success');
                setLoading(false); // Detiene el spinner al finalizar la petición
                //limpiamos el formulario
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    profileImage: null
                });
            } catch (err) {
                setLoading(false); // Detiene el spinner al finalizar la petición
                console.error(err);
                if(err.response && err.response.data.message) {
                    Alertas.showToast(err.response.data.message, 'error');
                }else{
                    Alertas.showToast('Error al registrar el usuario', 'error');
                }
            }
        };

        fetchData();
        setError('');
    };

    return (
        <>
            <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
                <h1 className="text-center mb-4">Registro de Usuario</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <FormularioRegistro
                    formData={formData}
                    handleChange={handleChange}
                    handleImageChange={handleImageChange}
                    handleSubmit={handleSubmit}
                    handleClearImage={() => setFormData(prevState => ({ ...prevState, profileImage: undefined, nameImage: '' }))}
                />
                {loading && <div className="text-center mt-3"><Spinner animation="border" variant="primary" /></div>}
            </div>
        </>
    );
};

export default RegistroUsuario;
