
import { useState } from "react";
import { Button, Table, Badge, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContext";
import { useOrders } from "../contexts/OrderContext";
import { useCart } from "../contexts/CartContext";

import CartDrawer from "../components/CartDrawer";
import OrderDetail from "../components/OrderDetail";

export default function OrdersPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { items: productos, updateProduct } = useProducts();
  const { myOrders, createOrder, updateStatus, removeOrder } = useOrders();
  const { cart, clearCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [error, setError] = useState("");


  const confirmOrder = () => {
    setError("");

    const sinStock = cart.find((i) => {
      const prod = productos.find((p) => p.id === i.id);
      return !prod || prod.stock < i.cantidad;
    });
    if (sinStock) {
      setError(`Stock insuficiente para ${sinStock.nombre}`);
      return;
    }

    cart.forEach((i) => {
      const prod = productos.find((p) => p.id === i.id);
      if (prod) {
        updateProduct(prod.id, { stock: prod.stock - i.cantidad });
      }
    });

    createOrder(cart);
    clearCart(); 
    setShowCart(false);
  };

  const cancelOrder = (order) => {
    if (!window.confirm(`¿Estás seguro de cancelar el pedido ${order.id.slice(0, 6)}?`)) {
      return;
    }

    order.items.forEach((i) => {
      const prod = productos.find((p) => p.id === i.id);
      if (prod) {
        updateProduct(prod.id, { stock: prod.stock + i.cantidad });
      }
    });

    removeOrder(order.id);
  };

  return (
    <Container className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mis Pedidos</h2>
        <Button
          variant="success"
          size="lg"
          onClick={() => setShowCart(true)}
        >
          Ver Carrito {cart.length > 0 && `(${cart.length})`}
        </Button>
      </div>

      {error && <Alert variant="danger" className="shadow-sm">{error}</Alert>}
      {myOrders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Aún no hay pedidos registrados.</p>
          <Button variant="primary" onClick={() => navigate('/productos')}>
            Ir a Productos
          </Button>
        </div>
      ) : (
        <Table bordered hover striped className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {myOrders
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((o) => (
                <tr key={o.id}>
                  <td>{o.id.slice(0, 6)}</td>
                  <td>{new Date(o.fecha).toLocaleString()}</td>
                  <td>${o.total}</td>
                  <td>
                    <Badge
                      bg={
                        o.estado === "PENDIENTE"
                          ? "warning"
                          : o.estado === "PREPARACION"
                          ? "info"
                          : "success"
                      }
                    >
                      {o.estado}
                    </Badge>
                  </td>
                  <td className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => {
                        setSelectedOrder(o);
                        setShowDetail(true);
                      }}
                    >
                      Ver
                    </Button>

                    {(o.estado !== "LISTO") && hasRole(["VENDEDOR", "ADMIN"]) && (
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => {
                          const next =
                            o.estado === "PENDIENTE" ? "PREPARACION" : "LISTO";
                          updateStatus(o.id, next);
                        }}
                      >
                        Avanzar estado
                      </Button>
                    )}

                    {o.estado !== "LISTO" && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => cancelOrder(o)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      <CartDrawer
        show={showCart}
        onHide={() => setShowCart(false)}
        onConfirm={confirmOrder}
      />

      <OrderDetail
        show={showDetail}
        onHide={() => setShowDetail(false)}
        order={selectedOrder}
      />
    </Container>
  );
}
