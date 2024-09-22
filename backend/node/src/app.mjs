import cors from "cors"
import router from "./routes/api.mjs";
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Ajustamos el limite de subida de archivos a 50mb
app.use(express.urlencoded({ extended: true }));  // Para datos enviados por formularios
app.use(router);


app.set("port", 4000);

export default app;