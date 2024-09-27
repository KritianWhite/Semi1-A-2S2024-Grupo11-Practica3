import boto3
from botocore.exceptions import BotoCoreError, ClientError
from config import config

# Crear cliente de AWS Comprehend
comprehend_client = boto3.client(
    'comprehend',
    region_name=config['region_ha'],
    aws_access_key_id=config['accessKeyId_comprehend'],
    aws_secret_access_key=config['secretAccessKey_comprehend']
)

# Crear cliente de AWS Translate
translate_client = boto3.client(
    'translate',
    region_name=config['region_ha'],
    aws_access_key_id=config['accessKeyId_translate'],
    aws_secret_access_key=config['secretAccessKey_translate']
)

def translate_text(text, target_lang):
    try:
        # Detectar el idioma del texto
        detect_response = comprehend_client.detect_dominant_language(Text=text)
        source_lang = detect_response['Languages'][0]['LanguageCode']
        print(f"Detected Language: {source_lang}")

        # Traducir el texto
        translate_response = translate_client.translate_text(
            Text=text,
            SourceLanguageCode=source_lang,
            TargetLanguageCode=target_lang
        )

        return translate_response['TranslatedText']
    except (BotoCoreError, ClientError) as error:
        print(f"Error: {error}")
        return None
