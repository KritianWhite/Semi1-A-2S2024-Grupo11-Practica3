from flask import Blueprint, request, jsonify
from config import config
from controllers.user import user

api_blueprint = Blueprint('api', __name__)

# Comprobar
@api_blueprint.route('/check', methods=['GET'])
def check():
    return jsonify({"status": 200, "message": "API Funcionando correctamente"}), 200

# Usuario

@api_blueprint.route('/user/register', methods=['POST'])
def register():
    return user['register']()

