import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Tooltip } from '@mui/material';

function UsuarioPage() {
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Si no hay token, redirige a login
  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      cargarMensajes();
    }
  }, []);

  const cargarMensajes = async () => {
    const res = await fetch('http://localhost:3000/api/mensajes/mios', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.error === 0) {
      setMensajes(data.mensajes);
    } else {
      alert(data.msg);
    }
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/api/mensajes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contenido: mensaje }),
    });

    const data = await res.json();
    if (data.error === 0) {
      alert('Mensaje enviado');
      setMensaje('');
      cargarMensajes();
    } else {
      alert(data.msg);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="Cerrar sesión">
            <IconButton onClick={logout} color="error">
              <Typography>Cerrar Sesión.</Typography>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h5" gutterBottom>
          Enviar mensaje anónimo al administrador
        </Typography>
        <Box component="form" onSubmit={enviarMensaje}>
          <TextField
            label="Escribe tu mensaje"
            fullWidth
            multiline
            rows={4}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            margin="normal"
          />
          <Button type="submit" variant="contained">
            Enviar
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Mis mensajes y respuestas
        </Typography>

        {mensajes.map((m) => (
          <Card key={m.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="body1">📨 {m.mensaje}</Typography>
              <Typography variant="caption" color="text.secondary">
                Enviado el: {new Date(m.fecha_envio).toLocaleString()}
              </Typography>

              {m.respuesta && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="primary">
                    🗨️ Respuesta del admin:
                  </Typography>
                  <Typography variant="body1">{m.respuesta}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Respondido el: {new Date(m.fecha_respuesta).toLocaleString()}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default UsuarioPage;
