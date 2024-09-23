import { RekognitionClient, CompareFacesCommand, DetectTextCommand } from "@aws-sdk/client-rekognition";
import config from "../config.mjs";

const compareFaces = async (buff, path) => {
  const client = new RekognitionClient({
    region: config.rekognition.region,
    credentials: {
      accessKeyId: config.rekognition.accessKeyId,
      secretAccessKey: config.rekognition.secretAccessKey,
    },
  });

  const command = new CompareFacesCommand({
    SourceImage: {
      //imagen que el usuario sube para comparar
      Bytes: buff,
    },
    TargetImage: {
      // imagen que se encuentra en S3 del rostro como referencia
      S3Object: {
        Bucket: config.bucket,
        Name: path, //id de la imagen en S3
      },
    },
    SimilarityThreshold: 90, //umbral de similitud
  });

  try {
    const response = await client.send(command);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    client.destroy();
  }
};

const extractText = async (buff) => {
    const client = new RekognitionClient({
      region: config.rekognition.region,
      credentials: {
        accessKeyId: config.rekognition.accessKeyId,
        secretAccessKey: config.rekognition.secretAccessKey,
      },
    });
  
    const comando = new DetectTextCommand({
      Image: {
        Bytes: buff,
      },
    });
  
    try {
      const response = await client.send(comando);
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.destroy();
    }
  };

export { compareFaces, extractText };
