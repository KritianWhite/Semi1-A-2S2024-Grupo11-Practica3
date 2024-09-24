from config import config
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

def compareFaces(buff, path):
    #Configuracion del cliente Rekognition
    rekognition_client = boto3.client(
        'rekognition',
        region_name=config['rekognition']['region'],
        aws_access_key_id=config['rekognition']['accessKeyId'],
        aws_secret_access_key=config['rekognition']['secretAccessKey']
    )

    try:
        response = rekognition_client.compare_faces(
            SourceImage={
                'Bytes': buff
            },
            TargetImage={
                'S3Object': {
                    'Bucket': config['bucket'],
                    'Name': path
                }
            },
            SimilarityThreshold=90 # Umbral de similitud
        )

        return response
    except (NoCredentialsError, PartialCredentialsError) as e:
        print("Error al comparar las caras" + str(e))
        return None
    except Exception as e:
        print("Error al comparar las caras" + str(e))
        return None