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
  region: config.region_ha,
  credentials: {
    accessKeyId: config.accessKeyId_s3,
    secretAccessKey: config.secretAccessKey_s3,
  },
});

//aquí se sube el archivo a S3, sin utilizar base64
const UploadS3_ = async (filePath, fileName, fileType, folder) => {
  try {
    // Leer el archivo temporal desde el sistema de archivos
    const fileContent = fs.readFileSync(filePath);

    // Subir el archivo a AWS S3
    const upload = new Upload({
      client,
      params: {
        Bucket: config.bucket_s3, //bucket s3
        Key: `${folder}/${fileName}`, //nombre del archivo en s3
        Body: fileContent, //contenido del archivo
        ContentType: fileType, //tipo MIME
      },
    });

    // Borrar el archivo temporal del servidor una vez que se sube a S3
    fs.unlinkSync(filePath);

    const response = await upload.done();
    if (response.$metadata.httpStatusCode !== 200) {
      console.error(
        "Error al subir la imagen. Código de estado:",
        response.$metadata.httpStatusCode
      );
      return false;
    }

    console.log("La imagen se ha subido correctamente.");
    //console.log("URL de la imagen:", response.Location);
    return true;
  } catch (error) {
    console.error("Error al subir el archivo a S3:", error);
    fs.unlinkSync(filePath);
    return false;
  }
};

const generateSignedUrl = async (path) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: config.bucket_s3,
    Key: path,
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
    Bucket: config.bucket_s3,
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

export { UploadS3_, deleteObjectS3, generateSignedUrl };
