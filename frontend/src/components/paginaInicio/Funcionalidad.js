import React from 'react';
import { Button } from 'react-bootstrap';
import { Settings, Album, Edit, Upload, FileText, LogOut } from 'lucide-react'; // Importar los íconos desde lucide-react

const iconos = {
    settings: <Settings className="me-2" />,
    album: <Album className="me-2" />,
    edit: <Edit className="me-2" />,
    upload: <Upload className="me-2" />,
    'file-text': <FileText className="me-2" />,
    'log-out': <LogOut className="me-2" />
};

const Funcionalidad = ({ icon, texto, link, action, onClick }) => {
    return (
        <>
            <Button variant="outline-dark" className="w-100 mb-3 d-flex align-items-center" href={link} onClick={onClick}>
                {iconos[icon]}
                {texto}
            </Button>
        </>
    );
};

export default Funcionalidad;
