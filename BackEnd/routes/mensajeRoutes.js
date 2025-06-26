import express from 'express';
import { enviarMensaje, obtenerMisMensajes, obtenerTodosLosMensajes } from '../controllers/mensajeController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Enviar mensaje al admin
router.post('/', verifyToken, enviarMensaje);

// Obtener todos los mensajes que envió el usuario autenticado
router.get('/mios', verifyToken, obtenerMisMensajes);

// Obtener todos los mensajes
router.get('/todos', verifyToken, obtenerTodosLosMensajes);

export default router;
