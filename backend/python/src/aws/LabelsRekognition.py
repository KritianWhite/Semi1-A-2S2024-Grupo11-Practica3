import boto3
from botocore.exceptions import BotoCoreError, ClientError
from config import config

# Crear cliente de Rekognition
rekog_client = boto3.client(
    'rekognition',
    region_name=config['rekognition']['region'],
    aws_access_key_id=config['rekognition']['accessKeyId'],
    aws_secret_access_key=config['rekognition']['secretAccessKey']
)

bucket = config['bucket_s3']

def detect_labels(photo):
    try:
        response = rekog_client.detect_labels(
            Image={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': photo
                }
            }
        )
        etiquetas = []
        for label in response['Labels']:
            etiquetas.append(label['Name'])
            # Puedes descomentar el código siguiente para más detalles
            # print(f"Confidence: {label['Confidence']}")
            # print(f"Name: {label['Name']}")
            # print("Instances:")
            # for instance in label.get('Instances', []):
            #     print(instance)
            # print("Parents:")
            # for parent in label.get('Parents', []):
            #     print(parent)
            # print("-------")
        return etiquetas  # Para pruebas unitarias
    except (BotoCoreError, ClientError) as err:
        print("Error", err)
        return None

rekognition = {
    "detect_labels": detect_labels
}