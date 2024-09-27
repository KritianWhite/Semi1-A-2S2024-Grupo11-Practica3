import boto3
import os
from botocore.exceptions import BotoCoreError, ClientError
from config import config

# Crear cliente de S3
s3_client = boto3.client(
    's3',
    region_name=config['region_ha'],
    aws_access_key_id=config['accessKeyId_s3'],
    aws_secret_access_key=config['secretAccessKey_s3']
)

# Subir archivo a S3 desde el sistema de archivos (no base64)
def upload_s3(file_path, file_name, file_type, folder):
    try:
        with open(file_path, 'rb') as file_content:
            s3_client.put_object(
                Bucket=config['bucket_s3'],
                Key=f"{folder}/{file_name}",
                Body=file_content,
                ContentType=file_type
            )

        # Borrar el archivo temporal una vez subido
        os.remove(file_path)

        print("El archivo se ha subido correctamente.")
        return True
    except (BotoCoreError, ClientError) as error:
        print(f"Error al subir el archivo a S3: {error}")
        # Intentar eliminar el archivo temporal si no se subió correctamente
        if os.path.exists(file_path):
            os.remove(file_path)
        return False

# Subir archivo a S3 desde buffer (base64)
def upload_s3_base64(buff, path):
    try:
        s3_client.put_object(
            Bucket=config['bucket_s3'],
            Key=path,
            Body=buff,
            ContentType="image/jpeg"
        )
        return True
    except (BotoCoreError, ClientError) as error:
        print(f"Error al subir el archivo a S3: {error}")
        return False

# Generar una URL firmada con expiración
def generate_signed_url(path, expiration=3600):
    try:
        signed_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': config['bucket_s3'], 'Key': path},
            ExpiresIn=expiration
        )
        return signed_url
    except (BotoCoreError, ClientError) as error:
        print(f"Error al generar la URL firmada: {error}")
        return None

# Eliminar objeto de S3
def delete_object_s3(path):
    try:
        response = s3_client.delete_object(
            Bucket=config['bucket_s3'],
            Key=path
        )
        return response
    except (BotoCoreError, ClientError) as error:
        print(f"Error al eliminar el objeto de S3: {error}")
        return None
