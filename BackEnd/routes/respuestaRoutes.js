import express from 'express';
import { responderMensaje } from '../controllers/respuestaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Solo el admin puede responder mensajes
router.post('/:mensajeId', verifyToken, isAdmin, responderMensaje);

export default router;
