
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useFormValidation } from "../hooks/useFormValidation";

const empty = { username: "", password: "", nombre: "", role: "CLIENTE" };

const prepareInitialData = (initial) => {
  if (!initial) return empty;
  return { ...initial, password: initial.password ?? "" };
};

const validate = (form, editData) => {
  const e = {};
  if (!form.username.trim()) e.username = "Ingrese usuario";
  if (!editData && !form.password.trim()) e.password = "Ingrese contraseña";
  if (!form.nombre.trim()) e.nombre = "Ingrese nombre";
  if (!["ADMIN","VENDEDOR","CLIENTE"].includes(form.role)) e.role = "Rol inválido";
  return e;
};

export default function UserForm({ show, onHide, onSubmit, initial }) {
  const { form, errors, handleChange, handleSubmit } = useFormValidation(
    empty,
    validate,
    prepareInitialData(initial),
    show
  );

  const submit = (ev) => {
    handleSubmit(ev, (formData) => {
      const payload = {
        username: formData.username.trim(),
        password: formData.password.trim() || (initial?.password ?? "1234"),
        nombre: formData.nombre.trim(),
        role: formData.role
      };
      onSubmit(payload);
    });
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>{initial ? "Editar usuario" : "Nuevo usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                isInvalid={!!errors.username}
                disabled={!!initial}
              />
              <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={form.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                isInvalid={!!errors.role}
              >
                <option value="CLIENTE">Cliente</option>
                <option value="VENDEDOR">Vendedor</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label>Contraseña {initial && <small className="text-muted">(dejar vacío para no cambiar)</small>}</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
