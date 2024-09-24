import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });


export default {
    host: process.env.HOST || "",
    port: process.env.PORT || 0,
    database: process.env.DATABASE || "",
    userdatab: process.env.USERDATAB || "",
    password: process.env.PASSWORD || "",


    /****************Credenciales mias******************* */
    region_ha: process.env.REGION_HA || "",
    // credenciales S3
    accessKeyId_s3: process.env.ACCESS_KEY_ID_S3 || "",
    secretAccessKey_s3: process.env.SECRET_ACCESS_KEY_S3 || "",
    bucket_s3: process.env.BUCKET_S3 || "",

    //credenciales Comprehend
    //Esto es para la detección automatica de idioma
    accessKeyId_comprehend: process.env.ACCESS_KEY_ID_COMPREHEND || "",
    secretAccessKey_comprehend: process.env.SECRET_ACCESS_KEY_COMPREHEND || "",

    //credenciales Translate
    accessKeyId_translate: process.env.ACCESS_KEY_ID_TRANSLATE || "",
    secretAccessKey_translate: process.env.SECRET_ACCESS_KEY_TRANSLATE  || "",
    /************************************************************* */
    

    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    region: process.env.REGION || "",
    bucket: process.env.BUCKET  || "",
    
    //credenciales Rekognition
    rekognition: {
        accessKeyId: process.env.REKOGNITION_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.REKOGNITION_SECRET_ACCESS_KEY || "",
        region: process.env.REKOGNITION_REGION || ""
    }
};