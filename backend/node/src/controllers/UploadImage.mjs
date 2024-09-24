import { consult } from "../database/database.mjs";
import { UploadS3_, generateSignedUrl } from "../aws/S3Privado.mjs";
import fs from "fs";

const Upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }
    const filePath = req.file.path; // Ruta temporal del archivo
    const fileName = req.file.filename; // Nombre temporal del archivo
    const fileType = req.file.mimetype; // Tipo MIME del archivo
    const OriginalName = req.file.originalname; // Nombre original del archivo
    //const size = req.file.size; // Tamaño del archivo en bytes
    const CarpetaS3 = "Album_seminario1";

    const { album_id, descripcion, usuario_id } = req.body;

    if (!album_id || !descripcion || !usuario_id) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Faltan datos" });
    }

    //no se puede subir al album de fotos de perfil
    const fotos_perfil = await consult(
      `SELECT MIN(id) AS id FROM album WHERE usuario_id = ${usuario_id};`
    );
    if (fotos_perfil[0].status !== 200 || fotos_perfil[0].result.length === 0) {
      fs.unlinkSync(filePath);
      return res
        .status(404)
        .json({ message: "No se ha podido subir el archivo" });
    }

    if (fotos_perfil[0].result[0].id == album_id) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "No se puede subir imagenes al album de fotos de perfil",
      });
    }

    //despues de subir a s3, elimino el archivo temporal
    const response = await UploadS3_(filePath, fileName, fileType, CarpetaS3);
    if (!response) {
      return res.status(500).json({ error: "Error al subir el archivo a S3" });
    }

    const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    const url = `${CarpetaS3}/${fileName}`;
    const query =
      await consult(`INSERT INTO imagen (album_id, nombre, url_s3, descripcion, fecha_creacion) 
    VALUES (${album_id}, '${OriginalName}', '${url}', '${descripcion}', '${fecha}');`);

    if (query[0].status !== 200) {
      console.error(
        "Error al subir el archivo a la base de datos:",
        query[0].message
      );
      return res
        .status(500)
        .json({ message: "Error al subir el archivo a la base de datos" });
    }

    res.status(200).json({ message: "Archivo subido correctamente" });
  } catch (error) {
    console.error("Error al eliminar el album:", error);
    res.status(500).json({ message: "Error al eliminar el album" });
  }
};

const Get = async (req, res) => {
  try {
    const { album_id } = req.body;

    if (!album_id) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const response = await consult(`SELECT * FROM imagen WHERE album_id = ${album_id};`);

    if (response[0].status !== 200) {
      return res
        .status(404)
        .json({ message: "No se encontraron archivos en el album" });
    }

    const images = response[0].result;
    for (const image of images) {
      if (image.url_s3 !== null) {
        image.url_s3 = await generateSignedUrl(image.url_s3);
      }
    }
    res.status(200).json(images);
  } catch (error) {
    console.error("Error al obtener los archivos del album:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los archivos del album" });
  }
};

const Gallery = async (req, res) => {
  try {
    const { usuario_id } = req.body;

    if (!usuario_id) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const query = `
    SELECT 
      a.id AS album_id,
      a.nombre AS album_nombre,
      (select url_s3 from imagen where album_id= i.album_id Limit 1) as url,
      COUNT(i.id) AS cantidad_imagenes
    FROM 
      album a
    LEFT JOIN 
      imagen i ON a.id = i.album_id
    WHERE 
      a.usuario_id = ${usuario_id}
    GROUP BY 
      a.id;`;

    const response = await consult(query);

    if (response[0].status !== 200) {
      return res
        .status(404)
        .json({ message: "No se encontraron archivos en el album" });
    }

    let albums = response[0].result;
    for (const album of albums) {
      if (album.url !== null) {
        album.url = await generateSignedUrl(album.url); // Ahora sí se espera el await
      }
    }
    res.status(200).json(albums);
  } catch (error) {
    console.error("Error al obtener los archivos del album:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los archivos del album" });
  }
};

export const UploadImage = {
  Upload,
  Get,
  Gallery,
};
