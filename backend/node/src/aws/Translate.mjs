import {
  ComprehendClient,
  DetectDominantLanguageCommand,
} from "@aws-sdk/client-comprehend";
import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";
import config from "../config.mjs";

// Configura el cliente de AWS Comprehend
const comprehendClient = new ComprehendClient({
  region: config.region, // Reemplaza con tu región
  credentials: {
    accessKeyId: config.accessKeyId_comprehend, // O tu ACCESS_KEY_ID directamente
    secretAccessKey: config.secretAccessKey_comprehend, // O tu SECRET_ACCESS_KEY directamente
  },
});

// Configura el cliente de AWS Translate
const translateClient = new TranslateClient({
  region: config.region, // Reemplaza con tu región
  credentials: {
    accessKeyId: config.accessKeyId_translate, // O tu ACCESS_KEY_ID directamente
    secretAccessKey: config.secretAccessKey_translate, // O tu SECRET_ACCESS_KEY directamente
  },
});

const TranslateText = async (text, targetLang) => {
  try {
    // Detecta el idioma del texto
    const detectCommand = new DetectDominantLanguageCommand({ Text: text });
    const detectResponse = await comprehendClient.send(detectCommand);
    const sourceLang = detectResponse.Languages[0].LanguageCode;
    console.log(`Detected Language: ${sourceLang}`);

    // Traduce el texto
    const translateCommand = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
    });
    const translateResponse = await translateClient.send(translateCommand);
    //console.log(`Translated Text: ${translateResponse.TranslatedText}`);
    return translateResponse.TranslatedText;
  } catch (error) {
    console.error(error);
    return null;
  }
};
//detectAndTranslateText("Hola, ¿cómo estás?", "en");
export default TranslateText;
