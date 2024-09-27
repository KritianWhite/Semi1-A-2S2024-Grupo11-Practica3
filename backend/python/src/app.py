import signal
import os
from flask import Flask
from flask_cors import CORS
from routes.api import api_blueprint
from database.database import close_all_connections

app = Flask(__name__)
CORS(app)

app.register_blueprint(api_blueprint)
app.json.sort_keys = False

def handle_shutdown(sig, frame):
    print("Apagando servidor")
    close_all_connections()
    print("Conexiones cerradas")
    os._exit(0)

signal.signal(signal.SIGINT, handle_shutdown) # Ctrl + C
signal.signal(signal.SIGTERM, handle_shutdown) # kill pid

if __name__ == '__main__':
    port = 4000
    try:
        app.run(debug=False, host='0.0.0.0', port=port)
    except Exception as e:
        print(f"Error al ejecutar el servidor: {e}")
    finally:
        close_all_connections()
