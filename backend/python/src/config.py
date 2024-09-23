from dotenv import load_dotenv
import os
from pathlib import Path

env_path = Path('..') / '.env'
# Cargar las variables de entorno desde el archivo .env
load_dotenv(dotenv_path=env_path)

# Configuración
config = {
    "host": os.getenv("HOST", ""),
    "port": int(os.getenv("PORT", 0)),
    "database": os.getenv("DATABASE", ""),
    "userdatab": os.getenv("USERDATAB", ""),
    "password": os.getenv("PASSWORD", ""),

    "accessKeyId": os.getenv("ACCESS_KEY_ID", ""),
    "secretAccessKey": os.getenv("SECRET_ACCESS_KEY", ""),
    "region": os.getenv("REGION", ""),
    "bucket": os.getenv("BUCKET", ""),

    "rekognition": {
        "accessKeyId": os.getenv("REKOGNITION_ACCESS_KEY_ID", ""),
        "secretAccessKey": os.getenv("REKOGNITION_SECRET_ACCESS_KEY", ""),
        "region": os.getenv("REKOGNITION_REGION", "")
    }
}