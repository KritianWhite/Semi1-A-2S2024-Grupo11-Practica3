from database.database import consult
from aws.LabelsRekognition import rekognition
from aws.Translate import translate_text
from flask import request, jsonify
import random

def getRandomColor():
    colors = [
        "#F2B0F8", "#FEFFBE", "#C4FCAB", "#ACF4FE", "#89AFF9",
        "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#FFC6FF",
        "#FFA69E", "#A5FFD6", "#84DCC6", "#F1EB55", "#3EF4AA",
        "#3174DC", "#FFB361", "#ADE8EB"
    ]

    randomIndex = random.randint(0, len(colors) - 1)
    return colors[randomIndex]

def getTags():
    try:
        data = request.json
        id = data['id']
        descripcion = data['descripcion']

        if not id or not descripcion:
            return jsonify({"message": "Faltan datos"}), 400
        
        query = consult(f"SELECT * FROM imagen WHERE id = {id};")

        if query[0]['status'] != 200 and len(query[0]['result']) == 0:
            return jsonify({"message": "Imagen no encontrada"}), 404
        
        tags = rekognition['detect_labels'](query[0]['result'][0]['url_s3'])

        if not tags:
            return jsonify({"message": "No se pudo generar las etiquetas"}), 500
        
        tagsList = []
        for tag in tags:
            tagsList.append({ "tag": tag,"color":getRandomColor()})

        return jsonify(tagsList[:10]), 200
            
    except Exception as e:
        print("Error al obtener las etiquetas" + e)
        return jsonify({"message": "Error al obtener las etiquetas"}), 500
    
def getTranslate():
    try:
        data = request.json
        text = data['text']
        language = data['lang']

        if not text or not language:
            return jsonify({"message": "Faltan datos"}), 400
        
        response = translate_text(text, language)

        if not response:
            return jsonify({"message": "No se pudo traducir el texto"}), 500
        
        return jsonify({"text": response}), 200
    except Exception as e:
        print("Error al traducir el texto" + e)
        return jsonify({"message": "Error al traducir el texto"}), 500

TranslateTags = {
    'getTags': getTags,
    'getTranslate': getTranslate
}

