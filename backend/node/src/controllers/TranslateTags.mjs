import { consult } from "../database/database.mjs";
import { rekognition } from "../aws/LabelsRekognition.mjs";
import TranslateText from "../aws/Translate.mjs";

//imagen a la que se le generaran los tags y se traducirá el texto
const getTags = async (req, res) => {

  try {
    const { id, descripcion } = req.body;
    console.log(id, descripcion);
    if (!id || !descripcion) {
      res.status(400).json({ message: "id and descripcion are required" });
      return;
    }

    const query = await consult(`SELECT * FROM imagen WHERE id = ${id}`);
    
    if (query[0].status !== 200  && query[0].result.length === 0) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
     const tags = await rekognition.detect_labels(query[0].result[0].url_s3);
     if (!tags) {
       return res.status(500).json({ message: "No se pudo generar los tags" });
     }
     
     let tagsArray = [];
     tags.forEach((tag) => {
        tagsArray.push({ tag, color: getRandomColor() });
    });

    return res.json(tagsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

function getRandomColor() {
  const colors = [
    "#F2B0F8", "#FEFFBE", "#C4FCAB", "#ACF4FE", "#89AFF9",
    "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#FFC6FF",
    "#FFA69E", "#A5FFD6", "#84DCC6", "#F1EB55", "#3EF4AA",
    "#3174DC", "#FFB361", "#ADE8EB"
  ];
  
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

const getTranslate = async (req, res) => {
  const { text, lang } = req.body;
  if (!text || !lang) {
    return res.status(400).json({ message: "text and lang are required" });
  }
  
  const response = await TranslateText(text, lang);
  if (!response) {
    return res.status(500).json({ message: "Error al traducir el texto" });
  }
  return res.json({ text: response });
}

export const TranslateTags = {
  getTags,
  getTranslate
};