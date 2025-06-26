import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifica si el usuario ya existe
    const [userExists] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (userExists.length > 0) {
      return res.status(400).json({ error: 1, msg: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hashedPassword]);

    res.status(201).json({ error: 0, msg: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 1, msg: 'Error en el servidor' });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 1, msg: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 1, msg: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ error: 0, msg: 'Login exitoso', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 1, msg: 'Error en el servidor' });
  }
};
