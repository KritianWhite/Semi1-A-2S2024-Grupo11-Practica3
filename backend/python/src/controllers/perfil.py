from database.database import consult
from aws.S3Privado import generate_signed_url, upload_s3, delete_object_s3
import bcrypt
from flask import request, jsonify
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'uploads/'

def getProfileImage():
    try:
        data = request.json
        id = data['id']

        if not id:
            return jsonify({"message": "Faltan datos"}), 400
        
        result = consult(f"SELECT url_foto FROM usuario WHERE id = {id};")

        if len(result[0]['result']) == 0:
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        url = generate_signed_url(result[0]['result'][0]['url_foto'])

        if not url:
            return jsonify({"message": "Error al obtener la imagen de perfil"}), 500

        return jsonify({"url_foto": url}), 200
    except Exception as e:
        print("Error al obtener la imagen de perfil" + e)
        return jsonify({"message": "Error al obtener la imagen de perfil"}), 500
    
def update():
    try:
        data = request.form
        file = request.files.get('file')

        id = data.get('id')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not id or not username or not email or not password:
            return jsonify({"message": "Faltan datos"}), 400
        
        datos = consult(f"SELECT * FROM usuario WHERE id = {id};")
        if datos[0]['status'] != 200 or len(datos[0]['result']) == 0:
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        #verificar contraseña
        stored_password = datos[0]['result'][0]['password'].encode('utf-8')
        password = password.encode('utf-8')
        if not bcrypt.checkpw(password, stored_password):
            return jsonify({"status": 401,"message": "Contraseña incorrecta"}), 401
        
        #vrificar que no exista otro usuario con el mismo username o email
        verificarUser = consult(f"SELECT * FROM usuario WHERE nombre = '{username}' OR correo = '{email}';")

        if verificarUser[0]['status'] != 200 or len(verificarUser[0]['result']) > 0:
            if verificarUser[0]['result'][0]['nombre'] != username and verificarUser[0]['result'][0]['correo'] != email:
                return jsonify({"message": "Ya existe un usuario con esas credenciales"}), 400
            
        #Archivo en la petición
        if file:
            #guardar termporalmente el archivo
            if not os.path.exists(UPLOAD_FOLDER):
                os.makedirs(UPLOAD_FOLDER)
            
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            fileType = file.mimetype

            CarpetaS3 = "Fotos_Perfil"

            #subir archivo a S3

            response = upload_s3(file_path, filename, fileType, CarpetaS3)

            if not response:
                return jsonify({"message": "Error al subir la imagen a s3"}), 500

            #actualizo los nuevos datos

            url = f"{CarpetaS3}/{filename}"
            query = consult(f"UPDATE usuario SET nombre = '{username}', correo = '{email}', url_foto = '{url}' WHERE id = {id};")

            if query[0]['status'] != 200:
                print(query)
                return jsonify({"message": "Error al actualizar la información del usuario"}), 500
            
            else:
                url_s3 = generate_signed_url(url)

                if not url_s3:
                    return jsonify({"message": "Error al obtener la imagen de eprfil"}), 500
                
                #obtengo el album de fotos de perfil del usuario
                album = consult(f"SELECT id FROM album WHERE usuario_id = {id} AND nombre = 'Fotos de perfil';")
                
                if album[0]['status'] != 200 or len(album[0]['result']) == 0:
                    return jsonify({"message": "Error al obtener el album de fotos de perfil"}), 500
                
                #inserto la imagen en el album de fotos de perfil
                query = consult(f"INSERT INTO imagen (album_id, nombre, url_s3, descripcion, fecha_creacion) VALUES ({album[0]['result'][0]['id']}, '{filename}', '{url}', '', current_timestamp);")

                if query[0]['status'] != 200:
                    return jsonify({"message": "Error al insertar la imagen en el album de fotos de perfil"}), 500

                return jsonify({"message":"Información actualizada correctamente","url_foto": url_s3}), 200
        else:
            query = consult(f"UPDATE usuario SET nombre = '{username}', correo = '{email}' WHERE id = {id};")

            if query[0]['status'] != 200:
                return jsonify({"message": "Error al actualizar la información del usuario"}), 500
            
            return jsonify({"message":"Información actualizada correctamente", "url_foto": None}), 200
        
    except Exception as e:
        print("Error al actualizar el perfil" + e)
        return jsonify({"message": "Error al actualizar la información del usuario"}), 500

def deleteAccount():
    try:
        data = request.json
        id = data['id']
        password = data['password']

        if not id or not password:
            return jsonify({"message": "Faltan datos"}), 400
        
        datos = consult(f"SELECT * FROM usuario WHERE id = {id};")

        if datos[0]['status'] != 200 or len(datos[0]['result']) == 0:
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        #verificar contraseña
        stored_password = datos[0]['result'][0]['password'].encode('utf-8')
        password = password.encode('utf-8')
        if not bcrypt.checkpw(password, stored_password):
            return jsonify({"status": 401,"message": "Contraseña incorrecta"}), 401
        
        url = consult(f"select url_s3 from imagen im INNER JOIN album al ON al.id = im.album_id INNER JOIN usuario us ON us.id = al.usuario_id WHERE us.id = {id};")

        if url[0]['status'] != 200:
            return jsonify({"message": "Error al obtener las url de las imagenes"}), 500
        
        #eliminar las imagenes de s3
        for u in url[0]['result']:
            url_s3 = u['url_s3']
            delete_object_s3(url_s3)

        #eliminar la imagen de reconocimiento facial
        url = consult(f"SELECT key_s3 FROM rostros_usuarios WHERE usuario_id = {id};")
        
        if url[0]['status'] != 200:
            return jsonify({"message": "Error al obtener la imagen de reconocimiento facial"}), 500
        
        if len(url[0]['result']) > 0:
            key_s3 = url[0]['result'][0]['key_s3']

            delete_object_s3(key_s3)
        
        #eliminar las imagenes de la base de datos
        query = consult(f"DELETE FROM usuario WHERE id = {id};")
        if query[0]['status'] != 200:
            return jsonify({"message": "Error al eliminar la cuenta"}), 500
        
        return jsonify({"status": 200, "message": "Cuenta eliminada correctamente"}), 200

    except Exception as e:
        print("Error al eliminar la cuenta" + e)
        return jsonify({"message": "Error al eliminar la cuenta"}), 500

perfil = {
    "getProfileImage": getProfileImage,
    "update": update,
    "deleteAccount": deleteAccount
}