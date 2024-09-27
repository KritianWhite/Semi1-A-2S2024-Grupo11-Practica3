from database.database import consult
from aws.S3Privado import generate_signed_url, upload_s3
from flask import request, jsonify
import os
from werkzeug.utils import secure_filename
import datetime

UPLOAD_FOLDER = 'uploads/'

def Upload():
    try:
        if 'file' not in request.files:
            return jsonify({"message": "No se ha enviado ninguna imagen"}), 400
        
        data = request.form
        album_id = data['album_id']
        descripcion = data['descripcion']
        usuario_id = data['usuario_id']

        if not album_id or not descripcion or not usuario_id:
            return jsonify({"message": "Faltan datos"}), 400
        
        if not os.path.exists(UPLOAD_FOLDER):
                os.makedirs(UPLOAD_FOLDER)

        file = request.files['file']
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        filetype = file.mimetype

        CarpetaS3 = "Fotos_Publicadas"

        fotos_perfil  = consult(f"SELECT MIN(id) as id FROM album WHERE usuario_id = {usuario_id}")

        if fotos_perfil[0]['status'] != 200 or len(fotos_perfil[0]['result']) == 0:
            os.remove(file_path)
            return jsonify({"message": "No se ha podido subir la imagen"}), 404
        
        if int(fotos_perfil[0]['result'][0]['id']) == int(album_id):
            os.remove(file_path)
            return jsonify({"message": "No se puede subir la imagen al album de fotos de perfil"}), 400
        
        response = upload_s3(file_path, filename, filetype, CarpetaS3)
        if not response:
            os.remove(file_path)
            return jsonify({"message": "Error al subir imagen"}), 500
        
        url = f"{CarpetaS3}/{filename}"
        query = consult(f"INSERT INTO imagen (album_id, nombre, url_s3, descripcion, fecha_creacion) VALUES ({album_id}, '{filename}', '{url}', '{descripcion}', CURRENT_TIMESTAMP);")
        
        if query[0]['status'] != 200:
            return jsonify({"message": "Error al subir imagena la base de datos"}), 500
        
        return jsonify({"message":"Imagen subida correctamente"}), 200
    except Exception as e:
        print("Error al subir imagen" + e)
        return jsonify({"message": "Error al subir imagen"}), 500
    
def Get():
    try:
        data = request.json
        album_id = data['album_id']

        if not album_id:
            return jsonify({"message": "Faltan datos"}), 400
        
        query = consult(f"SELECT * FROM imagen WHERE album_id = {album_id};")

        if query[0]['status'] != 200:
            return jsonify({"message": "No se encontraron archivos en el album"}), 400
        
        images = query[0]['result']

        for image in images:
            image['url_s3'] = generate_signed_url(image['url_s3'])

        return jsonify(images), 200
                
    except Exception as e:
        print("Error al obtener las imagenes" + e)
        return jsonify({"message": "Error al obtener las imagenes"}), 500
    
def Gallery():
    try:
        data = request.json
        usuario_id = data['usuario_id']

        if not usuario_id:
            return jsonify({"message": "Faltan datos"}), 400
        
        query = consult(f"SELECT a.id AS album_id, a.nombre AS album_nombre, (select url_s3 from imagen where album_id = i.album_id limit 1) as url, COUNT(i.id) as cantidad_imagenes FROM album a LEFT JOIN imagen i ON a.id = i.album_id WHERE a.usuario_id = {usuario_id} GROUP BY a.id;")

        if query[0]['status'] != 200:
            return jsonify({"message": "No se encontraron archivos en el album"}), 500
        
        albums = query[0]['result']

        for album in albums:
            if album['url']:
                album['url'] = generate_signed_url(album['url'])
        
        return jsonify(albums), 200
    except Exception as e:
        print("Error al obtener los archivos del album" + e)
        return jsonify({"message": "Error al obtener los album"}), 500
    
UploadImage = {
    "Upload": Upload,
    "Get": Get,
    "Gallery": Gallery
}