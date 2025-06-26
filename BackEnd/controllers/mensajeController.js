import db from '../config/db.js';

export const enviarMensaje = async (req, res) => {
  const { contenido } = req.body;
  const de_usuario_id = req.user.id;

  try {
    await db.query(
      'INSERT INTO mensajes (de_usuario_id, contenido) VALUES (?, ?)',
      [de_usuario_id, contenido]
    );
    res.json({ error: 0, msg: 'Mensaje enviado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 1, msg: 'Error al enviar el mensaje' });
  }
};

export const obtenerMisMensajes = async (req, res) => {
  const usuario_id = req.user.id;

  try {
    const [mensajes] = await db.query(
      `SELECT m.id, m.contenido AS mensaje, m.fecha_envio, r.contenido AS respuesta, r.fecha_respuesta
       FROM mensajes m
       LEFT JOIN respuestas r ON m.id = r.mensaje_id
       WHERE m.de_usuario_id = ?
       ORDER BY m.fecha_envio DESC`,
      [usuario_id]
    );
    res.json({ error: 0, mensajes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 1, msg: 'Error al obtener los mensajes' });
  }
};

export const obtenerTodosLosMensajes = async (req, res) => {
  
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 1, msg: 'Acceso denegado' });
  }

  try {
    
    const [rows] = await db.query(`
      SELECT m.id, m.de_usuario_id, m.contenido AS mensaje, m.fecha_envio,
       r.contenido AS respuesta, r.fecha_respuesta
FROM mensajes m
LEFT JOIN respuestas r ON m.id = r.mensaje_id
ORDER BY m.fecha_envio DESC;
    `);

    res.json({ error: 0, mensajes: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 1, msg: 'Error al obtener todos los mensajes' });
  }
};
