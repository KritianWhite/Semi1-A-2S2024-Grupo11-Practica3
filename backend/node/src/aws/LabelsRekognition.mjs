import { DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { RekognitionClient } from "@aws-sdk/client-rekognition";
import config from "../config.mjs";

// Esto es para reconocer etiquetas en una imagen
const rekogClient = new RekognitionClient({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId_s3,
    secretAccessKey: config.secretAccessKey_s3,
  },
});
const bucket = config.bucket_s3;

const detect_labels = async (photo) => {
  try {
    const params = {
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: photo,
        },
      },
    };

    const response = await rekogClient.send(new DetectLabelsCommand(params));
    const etiquetas = [];
    response.Labels.forEach((label) => {
      etiquetas.push(label.Name);
      /*console.log(`Confidence: ${label.Confidence}`);
      console.log(`Name: ${label.Name}`);
      console.log("Instances:");
      label.Instances.forEach((instance) => {
        console.log(instance);
      });
      console.log("Parents:");
      label.Parents.forEach((name) => {
        console.log(name);
      });
      console.log("-------");*/
    });
    return etiquetas; // For unit tests.
  } catch (err) {
    console.log("Error", err);
    return null;
  }
};

export const rekognition = { detect_labels };
