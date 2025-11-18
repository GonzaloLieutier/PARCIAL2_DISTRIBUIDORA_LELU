
import { Offcanvas, Button, Table, ButtonGroup } from "react-bootstrap";
import { useCart } from "../contexts/CartContext";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

export default function CartDrawer({ show, onHide, onConfirm }) {
  const { cart, removeItem, updateQuantity, total } = useCart();

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Carrito de compras</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cart.length === 0 ? (
          <p className="text-muted">Todavia no hay productos en el carrito</p>
        ) : (
          <>
            <Table hover>
              <tbody>
                {cart.map(i => (
                  <tr key={i.id}>
                    <td>
                      <strong>{i.nombre}</strong>
                      <br />
                      <small className="text-muted">${i.precio} c/u</small>
                    </td>
                    <td className="text-center">
                      <ButtonGroup size="sm">
                        <Button
                          variant="outline-secondary"
                          disabled={i.cantidad <= 1}
                          onClick={() => updateQuantity(i.id, i.cantidad - 1)}
                        >
                          <FaMinus size={10} />
                        </Button>
                        <Button variant="outline-secondary" disabled style={{ minWidth: "40px" }}>
                          {i.cantidad}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          disabled={i.stock && i.cantidad >= i.stock}
                          onClick={() => updateQuantity(i.id, i.cantidad + 1)}
                        >
                          <FaPlus size={10} />
                        </Button>
                      </ButtonGroup>
                    </td>
                    <td className="text-end">
                      <strong>${i.precio * i.cantidad}</strong>
                    </td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => removeItem(i.id)}
                        title="Eliminar producto"
                      >
                        <FaTrash size={12} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h5 className="text-end mb-3">Total: ${total}</h5>
            <Button className="w-100" variant="success" onClick={onConfirm}>
              Confirmar pedido
            </Button>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
