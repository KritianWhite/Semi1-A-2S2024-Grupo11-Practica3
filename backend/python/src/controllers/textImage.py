import base64
from flask import request, jsonify
from aws.imageRekognition import extract_text

def extraerTexto():
    try:
        data = request.json
        image = data.get('image')

        if not image:
            return jsonify({"status": 400, "message": "Faltan campos por rellenar"}), 400
        
        base64_data = image.replace('data:image/png;base64,', '')
        base64_data = base64_data.replace('data:image/jpeg;base64,', '')
        image_bytes = base64.b64decode(base64_data)
        
        response = extract_text(image_bytes)
                
        if response and 'TextDetections' in response:
            text = "\n".join(
                detection['DetectedText'] for detection in response['TextDetections']
                if detection['Type'] == 'LINE'
            )
            return jsonify({'status': 200, 'text': text}), 200
        else:
            return jsonify({'status': 404, 'message': 'No se encontró texto en la imagen'}), 404

    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": "Error al extraer el texto"}), 500

text = {
    "extraerTexto": extraerTexto,    
}
