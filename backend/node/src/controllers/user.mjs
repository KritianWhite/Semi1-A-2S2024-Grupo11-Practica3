import * as bcrypt from "bcrypt";
import { consult } from "../database/database.mjs";
import config from "../config.mjs";
import { uploadImageS3, deleteObjectS3 } from "../aws/s3.mjs";
import { compareFaces } from "../aws/rekognition.mjs";

const register = async (req, res) => {
    const { username, email, password, profileImage } = req.body;
    try {

        if (username === undefined || email === undefined || password === undefined || profileImage === undefined) {
            return res.status(400).json({ status: 400, message: "Faltan campos por rellenar" });
        }

        //validamos que el email y el username no estén en uso

        const resultEmail = await consult(`select * from usuario where correo= '${email}';`);
        const resultUsername = await consult(`select * from usuario where nombre= '${username}';`);
        console.log(resultEmail);
        if (resultEmail[0].status == 200 && resultEmail[0].result.length > 0) {
            return res.status(400).json({ status: 400, message: "El email ya está en uso" });
        }
        
        if (resultUsername[0].status == 200 && resultUsername[0].result.length > 0) {
            return res.status(400).json({ status: 400, message: "El nombre de usuario ya está en uso" });
        }

        //subimos la imagen a S3
        const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, "");
        const buff = Buffer.from(base64Data, 'base64');
        //creamos el nombre de la imagen con el nombre de usuario y la fecha formateado a solo numeros sin espacios
        const nombreImagen = username + "_" + (new Date().toLocaleDateString().replace(/\//g, "") + new Date().toLocaleTimeString().replace(/:/g, "")) + ".jpeg";

        const response = await uploadImageS3(buff, "Fotos_Perfil/" + nombreImagen);

        if (response === null) {
            return res.status(500).json({ status: 500, message: "Error al subir la imagen" });
        }

        const url = `https://${config.bucket}.s3.${config.region}.amazonaws.com/Fotos_Perfil/${nombreImagen}`;

        //encriptamos la contraseña
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        //registramos al usuario

        const result = await consult(`insert into usuario (nombre, correo, password, url_foto, face_id_habilitado) values ('${username}', '${email}', '${hash}', '${url}', 0);`);

        if (result[0].result.affectedRows === 1) {
            //obtenemos el id del usuario
            const resultId = result[0].result.insertId;

            //Creamos el album de fotos de perfil
            const resultAlbum = await consult(`insert into album (nombre,usuario_id) values ('Fotos de perfil', ${resultId});`);
            if (resultAlbum[0].result.affectedRows !== 1) {
                return res.status(500).json({ status: 500, message: "Error al crear album de fotos de perfil el usuario" });
            }

            //obtenemos el id del album
            const resultIdAlbum = resultAlbum[0].result.insertId;
            //creamos la foto de perfil
            const resultFoto = await consult(`insert into imagen (album_id, url_s3, nombre, descripcion) values (${resultIdAlbum}, '${url}', '${nombreImagen}', '');`);

            if (resultFoto[0].result.affectedRows !== 1) {
                return res.status(500).json({ status: 500, message: "Error al crear foto de perfil" });
            }

            return res.status(200).json({ status: 200, message: "Usuario registrado correctamente" });
        } else {
            return res.status(500).json({ status: 500, message: "Error al registrar el usuario" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: "Error al registrar el usuario," + err });
    }
};

const login = async (req, res) => {
    const { identifier, password } = req.body; //identifier puede ser el email o el nombre de usuario
    try {
        if (identifier === undefined || password === undefined) {
            return res.status(400).json({ status: 400, message: "Faltan campos por rellenar" });
        }

        //buscamos al usuario
        const result = await consult(`select * from usuario where correo='${identifier}' or nombre='${identifier}';`);

        if (result[0].result.length === 0) {
            return res.status(404).json({ status: 404, message: "Usuario no encontrado" });
        }

        if (result[0].status == 200 && result[0].result.length > 0) {
            const user = result[0].result[0];

            //comparamos la contraseña
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ status: 401, message: "Contraseña incorrecta" });
            }

            //si todo está correcto
            const dataUser = {
                id: user.id,
                username: user.nombre,
                email: user.correo,
                url_foto: user.url_foto,
                face_id_habilitado: Boolean(user.face_id_habilitado)
            };

            return res.status(200).json({ status: 200, message: "Usuario logueado correctamente", data_user: dataUser });
        }
        const errorBd = result[0].error;
        return res.status(500).json({ status: 500, message: "Error al iniciar sesión. " + errorBd });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: "Error al iniciar sesión," + err });
    }
};

const registrarRostro= async (req, res) => {
    // Lógica para registrar el rostro en la base de datos
    try{
        const {id, username, faceImage} = req.body;
        if(id === undefined || faceImage === undefined || username === undefined){
            return res.status(400).json({status: 400, message: "Faltan campos por rellenar"});
        }

        //validamos que el usuario exista
        const resultUser = await consult(`select * from usuario where id=${id};`);

        if(resultUser[0].result.length === 0){
            return res.status(404).json({status: 404, message: "Usuario no encontrado"});
        }

        //subimos la imagen a S3
        const base64Data = faceImage.replace(/^data:image\/\w+;base64,/, "");
        const buff = Buffer.from(base64Data, 'base64');
        //creamos el nombre de la imagen con el nombre de usuario y la fecha formateado a solo numeros sin espacios
        const pathImagen = "Fotos_Reconocimiento_Facial/" + username + "_" + (new Date().toLocaleDateString().replace(/\//g, "") + new Date().toLocaleTimeString().replace(/:/g, "")) + ".jpeg";

        const response = await uploadImageS3(buff, pathImagen);

        if (response === null) {
            return res.status(500).json({ status: 500, message: "Error al subir la imagen" });
        }

        //validamos que el usuario no tenga un rostro registrado
        const resultFace = await consult(`select * from rostros_usuarios where usuario_id=${id};`);


        if(resultFace[0].result.length > 0){
            //el usuario ya tiene un rostro registrado debemos actualizarlo
            //eliminamos la imagen anterior de S3
            const keyS3 = resultFace[0].result[0].key_s3;
            const resultDelete = await deleteObjectS3(keyS3);

            if(resultDelete === null){
                return res.status(500).json({status: 500, message: "Error al eliminar la imagen anterior"});
            }

            //actualizamos la base de datos
            const result = await consult(`update rostros_usuarios set key_s3='${pathImagen}' where usuario_id=${id};`);

            if(result[0].result.affectedRows === 1){
                return res.status(200).json({status: 200, message: "Rostro actualizado correctamente"});
            }
        }else {
            //registramos el rostro
            let result = await consult(`insert into rostros_usuarios (usuario_id, key_s3) values (${id}, '${pathImagen}');`);

            if (result[0].result.affectedRows === 1) {
                //actualizamos el campo face_id_habilitado del usuario
                result = await consult('update usuario set face_id_habilitado=1 where id=' + id + ';');

                return res.status(200).json({status: 200, message: "Rostro registrado correctamente"});
            } else {
                return res.status(500).json({status: 500, message: "Error al registrar el rostro"});
            }
        }

    }catch(err){
        console.error(err);
        return register.status(500).json({status: 500, message: "Error al registrar el rostro"});
    }
}

const obtenerDatosReconocimientoFacial = async (req, res) => {
    // Lógica para obtener los datos del reconocimiento facial
    try{
        const {id} = req.params;
        if(id === undefined){
            return res.status(400).json({status: 400, message: "Faltan campos por rellenar"});
        }

        //validamos que el usuario exista
        const resultUser = await consult(`select * from usuario where id=${id};`);

        if(resultUser[0].result.length === 0){
            return res.status(404).json({status: 404, message: "Usuario no encontrado"});
        }

        //validamos que el usuario tenga un rostro registrado
        const resultFace = await consult(`select * from rostros_usuarios where usuario_id=${id};`);

        if(resultFace[0].result.length === 0){
            return res.status(404).json({status: 404, message: "El usuario no tiene un rostro registrado"});
        }

        const face = resultFace[0].result[0];

        const faceId = {
            id: face.id,
            url_foto_s3: `https://${config.bucket}.s3.${config.region}.amazonaws.com/${face.key_s3}`
        }

        return res.status(200).json({status: 200, face_id_data: faceId});
    }catch(err){
        console.error(err);
        return res.status(500).json({status: 500, message: "Error al obtener los datos del reconocimiento facial"});
    }
}

const toggleFaceId = async (req, res) => {
    // Lógica para habilitar o deshabilitar el reconocimiento facial
    try{
        const {id} = req.body;
        if(id === undefined){
            return res.status(400).json({status: 400, message: "Faltan campos por rellenar"});
        }

        //validamos que el usuario exista
        const resultUser = await consult(`select * from usuario where id=${id};`);

        if(resultUser[0].result.length === 0){
            return res.status(404).json({status: 404, message: "Usuario no encontrado"});
        }

        //obtenemos el estado actual del reconocimiento facial
        const resultFace = await consult(`select face_id_habilitado from usuario where id=${id};`);

        const faceIdHabilitado = resultFace[0].result[0].face_id_habilitado;

        //actualizamos el estado del reconocimiento facial
        const result = await consult(`update usuario set face_id_habilitado=${faceIdHabilitado === 1 ? 0 : 1} where id=${id};`);

        if(result[0].result.affectedRows === 1){
            return res.status(200).json({status: 200, message: faceIdHabilitado === 1 ? "Reconocimiento facial deshabilitado" : "Reconocimiento facial habilitado"});
        }else{
            return res.status(500).json({status: 500, message: "Error al actualizar el reconocimiento facial"});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({status: 500, message: "Error al actualizar el reconocimiento facial"});
    }
}

const loginFaceId = async (req, res) => {
    try{
        const {username, faceImage} = req.body;
        if(username === undefined || faceImage === undefined){
            return res.status(400).json({status: 400, message: "Faltan campos por rellenar"});
        }

        //validamos que el usuario exista ya sea nombre de usuario o correo
        const resultUser = await consult(`select * from usuario where nombre='${username}' or correo='${username}';`);

        if(resultUser[0].result.length === 0){
            return res.status(404).json({status: 404, message: "Usuario no encontrado"});
        }

        //validamos que el usuario tenga face_id_habilitado
        const user = resultUser[0].result[0];
        if(user.face_id_habilitado === 0){
            return res.status(401).json({status: 401, message: "El usuario no tiene reconocimiento facial habilitado"});
        }

        //como si está habilitado obtenemos el rostro registrado
        const resultFace = await consult(`select * from rostros_usuarios where usuario_id=${user.id};`);

        if(resultFace[0].result.length === 0){
            return res.status(404).json({status: 404, message: "El usuario no tiene un rostro configurado"});
        }

        const face = resultFace[0].result[0];

        //convertimos la imagen de base64 a buffer

        const base64Data = faceImage.replace(/^data:image\/\w+;base64,/, "");
        const buff = Buffer.from(base64Data, 'base64');

        //comparamos las imagenes
        const response = await compareFaces(buff, face.key_s3);

        if(response === null){
            return res.status(500).json({status: 500, message: "Error al validar rostro"});
        }

        console.log(response);

        if(response.FaceMatches.length > 0){
            const data_user = {
                id: user.id,
                username: user.nombre,
                email: user.correo,
                url_foto: user.url_foto,
                face_id_habilitado: Boolean(user.face_id_habilitado)
            };
            return res.status(200).json({status: 200, message: "Usuario logueado correctamente", data_user: data_user});
        }

        return res.status(401).json({status: 401, message: "Rostro no reconocido"});

    }catch(error){
        console.error(error);
        return res.status(500).json({status: 500, message: "Error al iniciar sesión con reconocimiento facial"});
    }
};

export const user = {
    register,
    login,
    registrarRostro,
    obtenerDatosReconocimientoFacial,
    toggleFaceId,
    loginFaceId
};