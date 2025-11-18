import { Modal, Table, Badge } from "react-bootstrap";

export default function OrderDetail({ show, onHide, order }) {
  if (!order) return null;

  const total = order.items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalle del pedido {order.id.slice(0, 6)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Fecha:</strong> {new Date(order.fecha).toLocaleString()} <br />
          <strong>Estado:</strong>{" "}
          <Badge
            bg={
              order.estado === "PENDIENTE"
                ? "warning"
                : order.estado === "PREPARACION"
                ? "info"
                : "success"
            }
          >
            {order.estado}
          </Badge>
        </p>

        <Table bordered hover>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id}>
                <td>{i.nombre}</td>
                <td>{i.cantidad}</td>
                <td>${i.precio}</td>
                <td>${i.precio * i.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h5 className="text-end">Total: ${total}</h5>
      </Modal.Body>
    </Modal>
  );
}
