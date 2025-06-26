import db from '../config/db.js';

export const responderMensaje = async (req, res) => {
  const { mensajeId } = req.params;
  const { contenido } = req.body;

  try {
    // Verifica si ya tiene respuesta
    const [existing] = await db.query(
      'SELECT * FROM respuestas WHERE mensaje_id = ?',
      [mensajeId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 1, msg: 'Este mensaje ya tiene una respuesta' });
    }

    await db.query(
      'INSERT INTO respuestas (mensaje_id, contenido) VALUES (?, ?)',
      [mensajeId, contenido]
    );
    res.json({ error: 0, msg: 'Respuesta enviada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 1, msg: 'Error al responder el mensaje' });
  }
};
