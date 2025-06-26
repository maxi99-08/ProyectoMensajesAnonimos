import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton, Tooltip } from "@mui/material";

function AdminPage() {
  const [mensajes, setMensajes] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      cargarMensajes();
    }
  }, []);

  const cargarMensajes = async () => {
    const res = await fetch("http://localhost:3000/api/mensajes/todos", {
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

  const handleResponder = async (mensajeId) => {
    const contenido = respuestas[mensajeId];
    if (!contenido) return;

    const res = await fetch(
      `http://localhost:3000/api/respuestas/${mensajeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido }),
      }
    );

    const data = await res.json();
    if (data.error === 0) {
      alert("Respuesta enviada");
      setRespuestas((prev) => ({ ...prev, [mensajeId]: "" }));
      cargarMensajes();
    } else {
      alert(data.msg);
    }
  };

  return (
    <Container maxWidth="md">
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
          Mensajes recibidos
        </Typography>
        
        {mensajes.length === 0 ? (
          <Typography>No hay mensajes por mostrar.</Typography>
        ) : (
          mensajes.map((m) => (
            <Card key={m.id} sx={{ my: 2 }}>
              <CardContent>
                <Typography variant="body1">📨 {m.mensaje}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Usuario ID: {m.usuario_id} — Enviado:{" "}
                  {new Date(m.fecha_envio).toLocaleString()}
                </Typography>

                {m.respuesta ? (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="primary">
                      ✅ Respondido:
                    </Typography>
                    <Typography>{m.respuesta}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fecha: {new Date(m.fecha_respuesta).toLocaleString()}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">Responder:</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={respuestas[m.id] || ""}
                      onChange={(e) =>
                        setRespuestas((prev) => ({
                          ...prev,
                          [m.id]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      variant="contained"
                      sx={{ mt: 1 }}
                      onClick={() => handleResponder(m.id)}
                    >
                      Enviar respuesta
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}

export default AdminPage;
