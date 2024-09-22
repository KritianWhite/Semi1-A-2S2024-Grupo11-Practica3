import config from "../config.mjs";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

const UploadS3 = async (filePath, fileName, fileType, folder) => {

  try {
    // Leer el archivo temporal desde el sistema de archivos
    const fileContent = fs.readFileSync(filePath);

    // Subir el archivo a AWS S3
    const upload = new Upload({
      client,
      params: {
        Bucket: config.bucket, //bucket s3
        Key: `${folder}/${fileName}`, //nombre del archivo en s3
        Body: fileContent, //contenido del archivo
        ContentType: fileType, //tipo MIME
      },
    });
  

    // Ejecutar el comando para subir el archivo a S3
    const response = await upload.done();

    // Borrar el archivo temporal del servidor una vez que se sube a S3
    fs.unlinkSync(filePath);

    return true;

  } catch (error) {
    console.error('Error al subir el archivo a S3:', error);
    // Borrar el archivo temporal en caso de error
    fs.unlinkSync(filePath);
    return false;
  }
}
  

const generateSignedUrl = async (path) => {

  // Crear el comando para obtener el objeto en S3
  const getObjectCommand = new GetObjectCommand({
    Bucket: config.bucket, // Bucket en S3
    Key: path, // Nombre del archivo en S3, lo pasas como argumento
  });

  try {
    // Generar URL firmada con tiempo de expiración (ej. 1 hora)
    const signedUrl = await getSignedUrl(client, getObjectCommand, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("Error al generar la URL firmada:", error);
    return null;
  }
};


const deleteObjectS3 = async (path) => {
  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: path,
  });

  try {
    const response = await client.send(command);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//path para subir a S3

export { UploadS3, deleteObjectS3, generateSignedUrl };
