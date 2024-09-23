import datetime
import bcrypt
from flask import request, jsonify
from database.database import consult
from config import config
import re
import base64
from aws.s3 import uploadImageS3, deleteObjectS3


def register():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        profileImage = data.get('profileImage')

        if not username or not email or not password or not profileImage:
            return jsonify({"status": 400, "message": "Faltan campos por rellenar"}), 404
        
        resultEmail = consult(f"select * from usuario where correo = '{email}'")
        resultUsername = consult(f"select * from usuario where nombre = '{username}'")

        if resultEmail[0]['status'] == 200 and len(resultEmail[0]['result']) > 0:
            return jsonify({"status": 400, "message": "El email ya está en uso"}), 400
        
        if resultUsername[0]['status'] == 200 and len(resultUsername[0]['result']) > 0:
            return jsonify({"status": 400, "message": "El nombre de usuario ya está en uso"}), 400
        
        # subimos la imagen a s3

        base64Data = profileImage.split(',')[1]
        buff = base64.b64decode(base64Data)
        #creamos el nombre de la imagen con el nombre de usuario y la fecha formateado a solo numeros sin espacios
        nombreImagen =  username + "_" + datetime.datetime.now().strftime("%Y%m%d%H%M%S") + ".jpeg"

        response = uploadImageS3(buff, "Fotos_Perfil/" +nombreImagen)

        if response is None:
            return jsonify({"status": 500, "message": "Error al subir la imagen"}), 500
        
        url = "https://" + config['bucket'] + ".s3." + config['region'] + ".amazonaws.com/Fotos_Perfil/" + nombreImagen


        hashedPassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=10))

        result = consult(f"insert into usuario (nombre, correo, password, url_foto, face_id_habilitado) values ('{username}', '{email}', '{hashedPassword.decode('utf-8')}', '{url}', 0)")

        if result[0]['status'] == 200 and result[0]['result']['affected_rows'] == 1:
            
            insertId = result[0]['result']['last_insert_id']

            #creamos el album de fotos de perfil del usuario
            resultAlbum = consult(f"insert into album (nombre, usuario_id) values ('Fotos de perfil', {insertId})")

            if resultAlbum[0]['status'] == 200 and resultAlbum[0]['result']['affected_rows'] == 1:
                resultIdAlbum = resultAlbum[0]['result']['last_insert_id']
                #creamos la foto de perfil
                resultFoto = consult(f"insert into imagen (album_id, url_s3, nombre, descripcion) values ({resultIdAlbum},'{url}','{nombreImagen}', '')")

                if resultFoto[0]['status'] == 200 and resultFoto[0]['result']['affected_rows'] == 1:
                    return jsonify({"status": 200, "message": "Usuario registrado correctamente"}), 200
                return jsonify({"status": 500, "message": "Error al crear foto de perfil"}), 500
            else:
                return jsonify({"status": 500, "message": "Error al crear album de fotos de perfil"}), 500
        else:
            return jsonify({"status": 500, "message": "Error al registrar el usuario"}), 500
    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": "Error al registrar el usuario"}), 500



user = {
    "register": register,
}
    

