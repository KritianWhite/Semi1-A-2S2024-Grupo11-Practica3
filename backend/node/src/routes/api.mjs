import {Router} from 'express';
import {user} from '../controllers/user.mjs';
import {text} from '../controllers/text-image.mjs';
import {Album} from '../controllers/album.mjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {UploadImage} from '../controllers/UploadImage.mjs';
import {TranslateTags} from '../controllers/TranslateTags.mjs';
import { profile } from '../controllers/perfil.mjs';

const router = Router();

//esto para guardar el archivo temporalmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/****Comprobación***/
router.get("/check", async (req, res) => {
    res.status(200).json({"status": 200, "message": "API Funcionando correctamente"});
});

//obtener imagen de perfil
router.post("/user/profile", profile.getProfileImage);
router.post("/user/update", upload.single('file'), profile.update);
router.post("/user/delete", profile.deleteAccount);

// Rutas de usuario
router.post("/user/register", user.register);
router.post("/user/login_credentials", user.login);
router.post("/user/register_face", user.registrarRostro);
router.get("/user/face_id_data/:id", user.obtenerDatosReconocimientoFacial);
router.put('/user/toggle_face_id', user.toggleFaceId);
router.post('/user/compare_faces', user.loginFaceId );


// Rutas de imagen
router.post("/image/extract-text", text.returntext);

// Rutas de album
router.post("/album/add", Album.Add);
router.post("/album/get", Album.Get);
router.post("/album/update", Album.Update);
router.post("/album/delete", Album.Delete);


// upload imagen
router.post("/image/upload", upload.single('file'), UploadImage.Upload);
router.post("/image/gallery", UploadImage.Gallery);
router.post("/image/get", UploadImage.Get);

//ruta para regresar tags y la traducción
router.post("/image/getags", TranslateTags.getTags);
router.post("/image/translate", TranslateTags.getTranslate);

export default router;