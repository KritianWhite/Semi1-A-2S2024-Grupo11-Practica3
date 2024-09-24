import boto3
from config import config
from botocore.exceptions import BotoCoreError, ClientError

def extract_text(buff):    
    client = boto3.client(
        'rekognition',
        region_name=config['rekognition']['region'],
        aws_access_key_id=config['rekognition']['accessKeyId'],
        aws_secret_access_key=config['rekognition']['secretAccessKey']
    )
    
    try:
        response = client.detect_text(
            Image={
                'Bytes': buff
            }
        )
        return response
    
    except (BotoCoreError, ClientError) as error:
        print(f"Error al detectar texto: {error}")
        return None