
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useFormValidation } from "../hooks/useFormValidation";

const empty = { nombre: "", precio: "", stock: "", categoria: "" };
  
const prepareInitialData = (initial) => {
  if (!initial) return empty;
  return {
    nombre: initial.nombre ?? "",
    precio: String(initial.precio ?? ""),
    stock: String(initial.stock ?? ""),
    categoria: initial.categoria ?? ""
  };
};

const validate = (form) => {
  const e = {};
  if (!form.nombre.trim()) e.nombre = "Ingrese nombre";
  const precio = Number(form.precio);
  if (Number.isNaN(precio) || precio <= 0) e.precio = "Precio inválido";
  const stock = Number(form.stock);
  if (!Number.isInteger(stock) || stock < 0) e.stock = "Stock inválido";
  if (!form.categoria.trim()) e.categoria = "Ingrese categoría";
  return e;
};

export default function ProductForm({ show, onHide, onSubmit, initial }) {
  const { form, errors, handleChange, handleSubmit } = useFormValidation(
    empty,
    validate,
    prepareInitialData(initial),
    show
  );

  const submit = (ev) => {
    handleSubmit(ev, (formData) => {
      const payload = {
        nombre: formData.nombre.trim(),
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        categoria: formData.categoria.trim()
      };
      onSubmit(payload);
    });
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>{initial ? "Editar producto" : "Nuevo producto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
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
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={form.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
                isInvalid={!!errors.precio}
              />
              <Form.Control.Feedback type="invalid">{errors.precio}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={form.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                isInvalid={!!errors.stock}
              />
              <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
            </Col>
            <Col xs={12}>
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                value={form.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                isInvalid={!!errors.categoria}
              />
              <Form.Control.Feedback type="invalid">{errors.categoria}</Form.Control.Feedback>
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
