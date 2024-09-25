import { consult } from "../database/database.mjs";
import { generateSignedUrl } from "../aws/S3Privado.mjs";
import { UploadS3_ } from "../aws/S3Privado.mjs";
import * as bcrypt from "bcrypt";

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
    const { id, username, email, password } = req.body;

    if (
      id === undefined ||
      username === undefined ||
      email === undefined ||
      password === undefined
    ) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const datos = await consult(`SELECT * FROM usuario WHERE id=${id};`);
    if (datos[0].status !== 200 || datos[0].result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!bcrypt.compareSync(password, datos[0].result[0].password)) {
      return res
        .status(401)
        .json({ status: 401, message: "Contraseña incorrecta" });
    }

    //verificar que no exista otro usuario con el mismo correo o nombre
    const verificarUser = await consult(
      `SELECT * FROM usuario WHERE correo='${email}' OR nombre='${username}';`
    );

    if (verificarUser[0].status !== 200 || verificarUser[0].result.length > 0) {
      if (
        verificarUser[0].result[0].correo !== email &&
        verificarUser[0].result[0].nombre !== username
      ) {
        return res
          .status(400)
          .json({ message: "Ya existe un usuario con esas credenciales" });
      }
    }

    if (req.file) {
      const filePath = req.file.path;
      const fileName = req.file.filename;
      const fileType = req.file.mimetype;
      //const OriginalName = req.file.originalname;
      const CarpetaS3 = "Fotos_Perfil";

      //despues de subir a s3, elimino el archivo temporal, aunque de error
      const response = await UploadS3_(filePath, fileName, fileType, CarpetaS3);
      if (!response) {
        return res
          .status(500)
          .json({ message: "Error al subir el archivo a S3" });
      }
      //actualizo los nuevos datos
      const url = `${CarpetaS3}/${fileName}`;
      const query = await consult(
        `UPDATE usuario SET nombre='${username}', correo='${email}', url_foto='${url}' WHERE id=${id};`
      );
      if (query[0].status !== 200) {
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

        return res.status(200).json({
          message: "Información actualizada correctamente",
          url_foto: url_s3,
        });
      }
    } else {
      const query = await consult(
        `UPDATE usuario SET nombre='${username}', correo='${email}' WHERE id=${id};`
      );
      if (query[0].status !== 200) {
        return res
          .status(500)
          .json({ message: "Error al actualizar la información del usuario" });
      } else {
        return res.status(200).json({
          message: "Información actualizada correctamente",
          url_foto: null,
        });
      }
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
