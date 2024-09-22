import config from "../config.mjs";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

//recibe un buffer y lo sube a S3
const uploadImageS3 = async (buff, path) => {
    const client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  
    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: path,
      Body: buff,
      ContentType: "image/jpeg",
    });
  
    try {
      const response = await client.send(command);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }finally{
      client.destroy();
    }
  };

  const deleteObjectS3 = async (path) => {
    let parts = path.split('/');
    parts = parts[parts.length - 2] + "/" + parts[parts.length - 1];
  
    const client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    const command = new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: parts,
    });
  
    try {
      const response = await client.send(command);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export { uploadImageS3, deleteObjectS3};
  