export const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 1, msg: 'Acceso restringido solo al administrador' });
  }
  next();
};
