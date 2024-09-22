import app from './app.mjs';
import { closePool } from './database/database.mjs';

const main = () => {
	app.listen(app.get("port"), () => {
		console.log(`Server on port ${app.get("port")}`);
	  });
	
	  // Manejar señales de interrupción (Ctrl+C)
	  process.on('SIGINT', async () => {
		console.log('Proceso interrumpido (SIGINT)');
		await closePool();
		process.exit(0); // Terminar el proceso con un código de éxito
	  });
	
	  // Manejar señales de terminación
	  process.on('SIGTERM', async () => {
		console.log('Proceso terminado (SIGTERM)');
		await closePool();
		process.exit(0); // Terminar el proceso con un código de éxito
	  });
	
	  // Manejar excepciones no capturadas
	  process.on('uncaughtException', async (error) => {
		console.error('Excepción no capturada:', error);
		await closePool();
		process.exit(1); // Terminar el proceso con un código de error
	  });
	
	  // Manejar rechazos de promesas no capturados
	  process.on('unhandledRejection', async (reason, promise) => {
		console.error('Rechazo de promesa no capturado en:', promise, 'razón:', reason);
		await closePool();
		process.exit(1); // Terminar el proceso con un código de error
	  });
};

main();