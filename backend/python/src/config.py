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
    },

    "region_ha": os.getenv("REGION_HA", ""),
    "accessKeyId_s3": os.getenv("ACCESS_KEY_ID_S3", ""),
    "secretAccessKey_s3": os.getenv("SECRET_ACCESS_KEY_S3", ""),
    "bucket_s3": os.getenv("BUCKET_S3", ""),

    #credenciales Comprenhend
    #esto es para la detección automatica de idioma

    "accessKeyId_comprehend": os.getenv("ACCESS_KEY_ID_COMPREHEND", ""),
    "secretAccessKey_comprehend": os.getenv("SECRET_ACCESS_KEY_COMPREHEND", ""),

    #credenciales Translate
    "accessKeyId_translate": os.getenv("ACCESS_KEY_ID_TRANSLATE", ""),
    "secretAccessKey_translate": os.getenv("SECRET_ACCESS_KEY_TRANSLATE", ""),
}