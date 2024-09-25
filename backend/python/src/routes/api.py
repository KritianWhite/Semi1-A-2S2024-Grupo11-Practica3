from flask import Blueprint, request, jsonify
from config import config
from controllers.user import user
from controllers.textImage import text

api_blueprint = Blueprint('api', __name__)

# Comprobar
@api_blueprint.route('/check', methods=['GET'])
def check():
    return jsonify({"status": 200, "message": "API Funcionando correctamente"}), 200

# Usuario

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