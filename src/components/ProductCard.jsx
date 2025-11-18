
import { Card, Badge } from "react-bootstrap";

export default function ProductCard({ producto, footer }) {
  const agotado = producto.stock === 0;
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-start">
          <span>{producto.nombre}</span>
          <Badge bg={agotado ? "secondary" : "success"}>
            {agotado ? "Sin stock" : `Stock: ${producto.stock}`}
          </Badge>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{producto.categoria}</Card.Subtitle>
        <Card.Text className="fs-5 fw-semibold">${producto.precio}</Card.Text>
      </Card.Body>
      {footer && <Card.Footer>{footer}</Card.Footer>}
    </Card>
  );
}
