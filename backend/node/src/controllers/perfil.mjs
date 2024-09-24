import { consult } from "../database/database.mjs";
import { generateSignedUrl } from "../aws/S3Privado.mjs";
import { UploadS3_ } from "../aws/S3Privado.mjs";
import fs from "fs";

const getProfileImage = async (req, res) => {
  const { id } = req.body;
  if (id === undefined) {
    return res.status(400).json({ message: "Faltan campos por rellenar" });
  }
  try {
    const result = await consult(
      `select url_foto from usuario where id=${id};`
    );
    if (result[0].result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const url = await generateSignedUrl(result[0].result[0].url_foto);
    if (!url) {
      return res
        .status(500)
        .json({ message: "Error al obtener la imagen de perfil" });
    }

    return res.status(200).json({ url_foto: url });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error al obtener la imagen de perfil" });
  }
};

const update = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Falta la imagen de perfil" });
    }
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const fileType = req.file.mimetype;
    //const OriginalName = req.file.originalname;
    const CarpetaS3 = "Fotos_Perfil";
    const { id, username, email } = req.body;

    if (id === undefined || username === undefined || email === undefined) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Faltan datos" });
    }

    //despues de subir a s3, elimino el archivo temporal, aunque de error
    const response = await UploadS3_(filePath, fileName, fileType, CarpetaS3);
    if (!response) {
      return res.status(500).json({ error: "Error al subir el archivo a S3" });
    }

    const url = `${CarpetaS3}/${fileName}`;
    const query = await consult(
      `UPDATE usuario SET nombre='${username}', correo='${email}', url_foto='${url}' WHERE id=${id};`
    );
    if (query[0].status !== 200) {
      console.error(
        "Error al actualizar la información del usuario:",
        query[0].message
      );
      return res
        .status(500)
        .json({ message: "Error al actualizar la información del usuario" });
    } else {
      const url_s3 = await generateSignedUrl(url);
      if (!url_s3) {
        return res
          .status(500)
          .json({ message: "Error al obtener la imagen de perfil" });
      }
      
      return res
        .status(200)
        .json({ message: "Información actualizada correctamente", url_foto: url_s3 });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error al actualizar la información del usuario" });
  }
};

export const profile = {
  getProfileImage,
  update,
};
