import { extractText } from "../aws/rekognition.mjs";

const returntext = async (req, res) => {
    try {
        const { image } = req.body;        
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        console.log(base64Data);
        const buffer = Buffer.from(base64Data, "base64");
        const response = await extractText(buffer);
        const text = response.TextDetections.filter(
            (detection) => detection.Type === "LINE"
        )
            .map((line) => line.DetectedText)
            .join("\n");
        res.json({ text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el texto" });
    }
};

export const text = { returntext };