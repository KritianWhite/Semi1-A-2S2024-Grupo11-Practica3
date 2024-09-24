import React, {useEffect, useState}from 'react';
import { useNavigate } from 'react-router-dom';

import PerfilUsuario from '../components/paginaInicio/PerfilUsuario';
import Funcionalidad from '../components/paginaInicio/Funcionalidad';
import {logout, getLocalStorage} from '../session';

const PaginaInicio = () => {
    const [usuario, setUsuario] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const data_user = getLocalStorage('data_user');
        if(!data_user) {
            logout();
            navigate('/inicio-sesion');
        }
        setUsuario(data_user);
    }, [navigate]
    );

    const handleLogout = (e) => {
        console.log('Cerrando sesión...');
        logout();
        navigate('/inicio-sesion');
    }

    return (
        <>
            <div className="col-md-8">
                <PerfilUsuario usuario={usuario} />
                <div className="row mt-4">
                    <div className="col-md-6">
                        <Funcionalidad icon="settings" texto="Configuración de la cuenta" link="/configuracion-cuenta" />
                    </div>
                    <div className="col-md-6">
                        <Funcionalidad icon="album" texto="Ver álbumes" link="/vista-album" />
                    </div>
                    <div className="col-md-6">
                        <Funcionalidad icon="edit" texto="Editar álbumes" link="/editar-album" />
                    </div>
                    <div className="col-md-6">
                        <Funcionalidad icon="upload" texto="Subir imagen" link="/cargar-imagen" />
                    </div>
                    <div className="col-md-6">
                        <Funcionalidad icon="file-text" texto="Extraer texto" link="/extraccion-texto" />
                    </div>
                    <div className="col-md-6">
                        <Funcionalidad icon="log-out" texto="Cerrar sesión" onClick={()=>handleLogout()} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaginaInicio;
