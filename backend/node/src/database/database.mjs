import config from "./../config.mjs";
import { createPool } from "mysql2/promise";

//para generar id unicos uuidv4

// Configuración del pool de conexiones
const dbConfig = {
  host: config.host,
  port: config.port,
  user: config.userdatab,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Crear una única instancia del pool de conexiones
const pool = createPool(dbConfig);

async function queryWithPool(query) {
  const connection = await pool.getConnection();
  try {
    const [consulta] = await connection.query(query);
    return {
      "status": 200,
      "message": "Consulta exitosa",
      "result": consulta,
    };
  } catch (error) {
    return {
      "status": 500,
      "message": error.message,
      "result": null,
    };
  } finally {
    connection.release(); // Asegurarse de liberar la conexión
  }
}

async function consult(texto) {
  const queries = Array(1).fill(texto);

  const result = await Promise.all(
        queries.map(async (query) => await queryWithPool(query))
  );

  return result;
}

async function closePool() {
  await pool.end();
}

export { consult, closePool };
