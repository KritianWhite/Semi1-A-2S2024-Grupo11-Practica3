import datetime
import bcrypt
from flask import request, jsonify
from database.database import consult
from config import config
import re
import base64
from aws.s3 import uploadImageS3, deleteObjectS3
from aws.rekognition import compareFaces


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

def login():
    try:
        data = request.json
        identifier = data.get('identifier') # puede ser el email o el nombre de usuario
        password = data.get('password')

        if not identifier or not password:
            return jsonify({"status": 400, "message": "Faltan campos por rellenar"}), 400
        
        result = consult(f"select * from usuario where correo = '{identifier}' or nombre = '{identifier}';")

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            user = result[0]['result'][0]

            #comparamos la contraseña
            if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                dataUser ={
                    "id": user['id'],
                    "username": user['nombre'],
                    "email": user['correo'],
                    "url_foto": user['url_foto'],
                    "face_id_habilitado": bool(user['face_id_habilitado'])
                }

                return jsonify({"status": 200, "message": "Usuario logeado correctamente", "data_user": dataUser}), 200
            else:
                return jsonify({"status": 400, "message": "Contraseña incorrecta"}), 400

        else:
            return jsonify({"status": 404, "message": "Usuario no encontrado"}), 404
    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": "Error al logear al usuario"}), 500

def registrarRostro():
    try:
        data = request.json
        id = data.get('id')
        username = data.get('username')
        faceImage = data.get('faceImage')

        if not id or not username or not faceImage:
            return jsonify({"status": 400, "message": "Faltan campos por rellenar"}), 400
        
        #validamos que el usuario exista
        resultUser = consult(f"select * from usuario where id = {id}")

        if resultUser[0]['status'] == 200 and len(resultUser[0]['result']) > 0:
            # subimos la imagen a s3

            base64Data = re.sub(r'^data:image/\w+;base64,', '', faceImage)
            buff = base64.b64decode(base64Data)
            #creamos el nombre de la imagen con el nombre de usuario y la fecha formateado a solo numeros sin espacios
            nombreImagen =  username + "_" + datetime.datetime.now().strftime("%Y%m%d%H%M%S") + ".jpeg"

            response = uploadImageS3(buff, "Fotos_Reconocimiento_Facial/" +nombreImagen)

            if response is None:
                return jsonify({"status": 500, "message": "Error al subir la imagen"}), 500
            
            #validamos que el usuario no tenga un rostro registrado
            resultFace = consult(f"select * from rostros_usuarios where usuario_id = {id};")

            if resultFace[0]['status'] == 200 and len(resultFace[0]['result']) > 0: #ya tiene un rostro registrado
                #borramos la imagen anterior de s3
                keyS3 = resultFace[0]['result'][0]['key_s3']
                responseDelete = deleteObjectS3(keyS3)

                if responseDelete is None:
                    return jsonify({"status": 500, "message": "Error al eliminar la imagen anterior"}), 500
                
                #actualizamos la imagen en la base de datos
                resultUpdate = consult(f"update rostros_usuarios set key_s3 = 'Fotos_Reconocimiento_Facial/{nombreImagen}' where usuario_id = {id};")
                
                if resultUpdate[0]['status'] == 200:
                    return jsonify({"status": 200, "message": "Rostro actualizado correctamente"}), 200
            else:
                #registramos el rostro
                resultInsert = consult(f"insert into rostros_usuarios (usuario_id, key_s3) values ({id}, 'Fotos_Reconocimiento_Facial/{nombreImagen}');")

                if resultInsert[0]['status'] == 200 and resultInsert[0]['result']['affected_rows'] == 1:
                    #actualizamos el campo face_id_habilitado en la tabla usuario
                    resultUpdateUser = consult(f"update usuario set face_id_habilitado = 1 where id = {id};")

                    return jsonify({"status": 200, "message": "Rostro registrado correctamente"}), 200
        else:
            return jsonify({"status": 404, "message": "Usuario no encontrado"}), 404

    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": "Error al registrar el rostro"}), 500

def obtenerDatosReconocimientoFacial(id):
    try:
        if not id:
            return jsonify({"status": 400, "message": "Faltan campos por rellenar"}), 400
        
        result = consult(f"select * from usuario where id = {id};")

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            resultFace = consult(f"select * from rostros_usuarios where usuario_id = {id};")

            if resultFace[0]['status'] == 200 and len(resultFace[0]['result']) > 0:
                face = resultFace[0]['result'][0]
                faceId = {
                    "id": face['id'],
                    "url_foto_s3": 'https://' + config['bucket'] + '.s3.' + config['region'] + '.amazonaws.com/' + face['key_s3']
                }

                return jsonify({"status": 200, "face_id_data": faceId}), 200
            else:
                return jsonify({"status": 404, "message": "El usuario no tiene un rostro registrado"}), 404
        else:
            return jsonify({"status": 404, "message": "Usuario no encontrado"}), 404
    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": "Error al obtener los datos"}), 500

def toggleFaceId():
    try:
        data = request.json
        id = data.get('id')

        if not id:
            return jsonify({"status": 400, "message": "Faltan campos por rellenar"}), 400
        
        result = consult(f"select * from usuario where id = {id};")

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            user = result[0]['result'][0]
            faceId = user['face_id_habilitado']

            if faceId == 1:
                faceId = 0
            else:
                faceId = 1

            resultUpdate = consult(f"update usuario set face_id_habilitado = {faceId} where id = {id};")

            if resultUpdate[0]['status'] == 200:
                if faceId == 1:
                    return jsonify({"status": 200, "message": "Reconocimiento facial habilitado"}), 200
                else:
                    return jsonify({"status": 200, "message": "Reconocimiento facial deshabilitado"}), 200
            else:
                return jsonify({"status": 500, "message": "Error al actualizar reconocimiento facial"}), 500
        else:
            return jsonify({"status": 404, "message": "Usuario no encontrado"}), 404
    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": "Error al actualizar le reconocimiento facial"}), 500

def loginFaceId():
    try:
        data = request.json
        identifier = data.get('username') # puede ser el email o el nombre de usuario
        faceImage = data.get('faceImage')

        if not identifier or not faceImage:
            return jsonify({"status": 400, "message": "Faltan campos por rellenar"}), 400
        
        #validamos que el usuario exista
        resultUser = consult(f"select * from usuario where correo = '{identifier}' or nombre = '{identifier}'")

        if resultUser[0]['status'] == 200 and len(resultUser[0]['result']) > 0:
            
            user = resultUser[0]['result'][0]
            if(user['face_id_habilitado'] == 0):
                return jsonify({"status": 400, "message": "El usuario no tiene habilitado el reconocimiento facial"}), 400
            
            #obtenemos el rostro del usuario
            resultFace = consult(f"select * from rostros_usuarios where usuario_id = {user['id']};")

            if resultFace[0]['status'] == 200 and len(resultFace[0]['result']) > 0:
                face = resultFace[0]['result'][0]
                #convertimos la imagen a bytes
                base64Data = re.sub(r'^data:image/\w+;base64,', '', faceImage)
                buff = base64.b64decode(base64Data)

                #comparamos las imagenes
                response = compareFaces(buff, face['key_s3'])

                if response is None:
                    return jsonify({"status": 500, "message": "Error al validar rostro"}), 500
                
                print(response)

                if len(response['FaceMatches']) > 0:
                    data_user ={
                        "id": user['id'],
                        "username": user['nombre'],
                        "email": user['correo'],
                        "url_foto": user['url_foto'],
                        "face_id_habilitado": bool(user['face_id_habilitado'])
                    }

                    return jsonify({"status": 200, "message": "Usuario logeado correctamente", "data_user": data_user}), 200
                
                return jsonify({"status": 401, "message": "Rostro no reconocido"}), 401

            else:
                return jsonify({"status": 404, "message": "El usuario no tiene un rostro configurado"}), 404
        else:
            return jsonify({"status": 404, "message": "Usuario no encontrado"}), 404
        
        
    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": "Error al logear al usuario"}), 500


user = {
    "register": register,
    "login_credentials": login,
    "registrarRostro": registrarRostro,
    "obtenerDatosReconocimientoFacial": obtenerDatosReconocimientoFacial,
    "toggleFaceId": toggleFaceId,
    "loginFaceId": loginFaceId
}
    

