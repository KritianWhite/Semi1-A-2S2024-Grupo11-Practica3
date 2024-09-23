from config import config
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

def uploadImageS3(buff, path):
    #Configuracion del cliente S3
    s3_client = boto3.client(
        's3',
        region_name=config['region'],
        aws_access_key_id=config['accessKeyId'],
        aws_secret_access_key=config['secretAccessKey']
    )

    try:
        response = s3_client.put_object(
            Body=buff,
            Bucket=config['bucket'],
            Key=path,
            ContentType='image/jpeg'
        )

        return response
    except (NoCredentialsError, PartialCredentialsError) as e:
        print("Error al subir la imagen a S3" + str(e))
        return None
    except Exception as e:
        print("Error al subir la imagen a S3" + str(e))
        return None

def deleteObjectS3(path):  #se recibe el path dentro del bucket, no la url completa
    #Configuracion del cliente S3
    s3_client = boto3.client(
        's3',
        region_name=config['region'],
        aws_access_key_id=config['accessKeyId'],
        aws_secret_access_key=config['secretAccessKey']
    )

    try:
        response = s3_client.delete_object(
            Bucket=config['bucket'],
            Key=path
        )

        return response
    except (NoCredentialsError, PartialCredentialsError) as e:
        print("Error al eliminar la imagen de S3" + str(e))
        return None
    except Exception as e:
        print("Error al eliminar la imagen de S3" + str(e))
        return None

 