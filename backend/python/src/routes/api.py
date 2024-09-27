from flask import Blueprint, request, jsonify
from config import config
from controllers.user import user
from controllers.textImage import text
from controllers.perfil import perfil
from controllers.album import album
from controllers.UploadImage import UploadImage
from controllers.TranslateTags import TranslateTags
import os
import uuid
import time
from werkzeug.utils import secure_filename

api_blueprint = Blueprint('api', __name__)

UPLOAD_FOLDER = 'uploads/'
    
# Comprobar
@api_blueprint.route('/check', methods=['GET'])
def check():
    return jsonify({"status": 200, "message": "API Funcionando correctamente"}), 200


#### Perfil
@api_blueprint.route('/user/profile', methods=['POST'])
def profile():
    return perfil['getProfileImage']()

@api_blueprint.route('/user/update', methods=['POST'])
def update():
    return perfil['update']()

@api_blueprint.route('/user/delete', methods=['POST'])
def delete():
    return perfil['deleteAccount']()


#### Usuario

@api_blueprint.route('/user/register', methods=['POST'])
def register():
    return user['register']()

@api_blueprint.route('/user/login_credentials', methods=['POST'])
def login_credentials():
    return user['login_credentials']()

@api_blueprint.route('/user/register_face', methods=['POST'])
def register_face():
    return user['registrarRostro']()

@api_blueprint.route('/user/face_id_data/<id>', methods=['GET'])
def face_id_data(id):
    return user['obtenerDatosReconocimientoFacial'](id)

@api_blueprint.route('/user/toggle_face_id', methods=['PUT'])
def toggle_face_id():
    return user['toggleFaceId']()

@api_blueprint.route('/user/compare_faces', methods=['POST'])
def compare_faces():
    return user['loginFaceId']()


# Texto en imagen
@api_blueprint.route('/image/extract-text', methods=['POST'])
def extract_text():
    return text['extraerTexto']()


### Album

@api_blueprint.route('/album/add', methods=['POST'])
def add_album():
    return album['add']()

@api_blueprint.route('/album/get', methods=['POST'])
def get_album():
    return album['Get']()

@api_blueprint.route('/album/update', methods=['POST'])
def update_album():
    return album['Update']()

@api_blueprint.route('/album/delete', methods=['POST'])
def delete_album():
    return album['Delete']()


### Imagen

@api_blueprint.route('/image/upload', methods=['POST'])
def upload_image():
    return UploadImage['Upload']()

@api_blueprint.route('/image/gallery', methods=['POST'])
def gallery():
    return UploadImage['Gallery']()

@api_blueprint.route('/image/get', methods=['POST'])
def get_images():
    return UploadImage['Get']()


#### Rutas para regresar tags y la traducción
@api_blueprint.route('/image/getags', methods=['POST'])
def get_tags():
    return TranslateTags['getTags']()

@api_blueprint.route('/image/translate', methods=['POST'])
def translate():
    return TranslateTags['getTranslate']()