
import { useState } from "react";
import { Offcanvas, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export default function LoginDrawer({ show, onHide }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    const res = login(form.username.trim(), form.password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setForm({ username: "", password: "" });
    onHide();
  };

  const handleClose = () => {
    setForm({ username: "", password: "" });
    setError("");
    onHide();
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Iniciar sesión</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoFocus
              placeholder="Ingresa tu usuario"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Ingresa tu contraseña"
            />
          </Form.Group>
          <Button type="submit" className="w-100 mb-3">Entrar</Button>
        </Form>
        <hr />
        <small className="text-muted">
          <strong>Usuarios de prueba:</strong><br />
          Admin: admin/admin<br />
          Vendedor: vendedor/1234<br />
          Cliente: cliente/1234
        </small>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
