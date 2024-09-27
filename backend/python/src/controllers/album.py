from database.database import consult
from config import config
from aws.S3Privado import delete_object_s3
from flask import request, jsonify

def Get():
    try:
        data = request.json
        usuario_id = data['usuario_id']

        if not usuario_id:
            return jsonify({"message": "Faltan datos"}), 400
        
        query = f"SELECT a.id AS id, a.nombre AS name, COUNT(i.id) as imageCount FROM album a LEFT JOIN imagen i ON a.id = i.album_id WHERE a.usuario_id = {usuario_id} GROUP BY a.id;"

        response = consult(query)

        if (response[0]['status'] != 200):
            return jsonify({"message": "No se encontraron archivos en el album"}), 500
        
        return jsonify(response[0]['result']), 200

    except Exception as e:
        print("Error al obtener los archivos del album" + e)
        return jsonify({"message": "Error al obtener los archivos del album"}), 500


def add():
    try:
        data = request.json
        usuario_id = data['usuario_id']
        nombre = data['nombre']

        if not usuario_id or not nombre:
            return jsonify({"message": "Faltan datos"}), 400
        
        query = f"INSERT INTO album (usuario_id, nombre) VALUES ({usuario_id}, '{nombre}');"

        response = consult(query)

        if (response[0]['status'] != 200):
            print("Error al crear el album, " + response[0]['message'])
            return jsonify({"message": "Error al crear el album"}), 500
        
        return Get()

    except Exception as e:
        print("Error al crear el album" + e)
        return jsonify({"message": "Error al crear el album"}), 500

def Update():
    try:
        data = request.json
        album_id = data['album_id']
        nombre = data['nombre']
        usuario_id = data['usuario_id']

        if not album_id or not nombre or not usuario_id:
            return jsonify({"message": "Faltan datos"}), 400
        
        fotos_perfil = consult(f"SELECT MIN(id) as id FROM album WHERE usuario_id = {usuario_id}")

        if (fotos_perfil[0]['status'] != 200 or len(fotos_perfil[0]['result']) == 0):
            return jsonify({"message": "No se ha podido renombrar el album"}), 404
        
        if fotos_perfil[0]['result'][0]['id'] == album_id:
            return jsonify({"message": "No se puede renombrar el album de fotos de perfil"}), 400
        
        query = f"UPDATE album SET nombre = '{nombre}' WHERE id = {album_id};"

        response = consult(query)

        if (response[0]['status'] != 200):
            return jsonify({"message": "No se pudo cambiar el nombre al album"}), 500
        
        return Get()
    except Exception as e:
        print("Error al actualizar el album" + e)
        return jsonify({"message": "Error al actualizar el album"}), 500
    
def Delete():
    try:
        data = request.json
        album_id = data['album_id']
        usuario_id = data['usuario_id']

        if not album_id or not usuario_id:
            return jsonify({"message": "Faltan datos"}), 400
        
        fotos_perfil = consult(f"SELECT MIN(id) as id FROM album WHERE usuario_id = {usuario_id}")

        if (fotos_perfil[0]['status'] != 200 or len(fotos_perfil[0]['result']) == 0):
            return jsonify({"message": "No se ha podido eliminar el album"}), 404
        
        if fotos_perfil[0]['result'][0]['id'] == album_id:
            return jsonify({"message": "No se puede eliminar el album de fotos de perfil"}), 400
        
        #obtengo la url de las imagenes del album en s3
        getUrl = consult(f"SELECT url_s3 as url FROM imagen WHERE album_id = {album_id};")

        if (getUrl[0]['status'] != 200):
            return jsonify({"message": "No se pudo obtener la url de las imagenes"}), 404

        #elimino las imagenes del album en s3
        for url in getUrl[0]['result']:
            delete_object_s3(url['url'])

        print("Archivos eliminados de bucket")

        #elimino las imagenes del album en la base de datos
        response = consult(f"DELETE FROM album WHERE id = {album_id};")

        if (response[0]['status'] != 200):
            return jsonify({"message": "No se pudo eliminar el album"}), 500
        
        return Get()
    except Exception as e:
        print("Error al eliminar el album" + e)
        return jsonify({"message": "Error al eliminar el album"}), 500
    
album = {
    "Get": Get,
    "add": add,
    "Update": Update,
    "Delete": Delete
}